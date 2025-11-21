import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { SecureDocumentService } from '../config/SecurityService';
import { AppelOffre } from './AOService';
import { Notification } from './NotifApprService';
import dayjs from 'dayjs';
import { OrdreDeService } from './OSService';
import {PvReception} from './PvReceptionService';
import api from '../utils/axiosInstance';

interface TemplateErrorProperties {
  errors: Array<{
    properties: {
      placeholder: string;
    };
  }>;
}

// Utility function to convert numbers to words in French
const numberToWords = (number: number): string => {
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];
  const thousands = ['', 'mille', 'million', 'milliard'];

  const convertHundreds = (n: number): string => {
    let result = '';
    if (n >= 100) {
      result += units[Math.floor(n / 100)] + ' cent ';
      n %= 100;
    }
    if (n >= 20) {
      result += tens[Math.floor(n / 10)];
      n %= 10;
      if (n > 0) {
        result += '-' + units[n];
      }
    } else if (n >= 10) {
      result += teens[n - 10];
    } else if (n > 0) {
      result += units[n];
    }
    return result.trim();
  };

  if (number === 0) return 'zéro';
  if (number < 0) return 'moins ' + numberToWords(-number);

  // Separate integer and decimal parts
  let integerPart = Math.floor(number);
  const decimalPart = Math.floor((number - integerPart) * 100);

  let result = '';
  let i = 0;

  while (integerPart > 0) {
    const thousandsPart = integerPart % 1000;
    if (thousandsPart > 0) {
      result = convertHundreds(thousandsPart) + ' ' + thousands[i] + (result ? ' ' + result : ' dirhams');
    }
    integerPart = Math.floor(integerPart / 1000);
    i++;
  }

  // Add decimal part if it exists
  if (decimalPart > 0) {
    result += ' dirhams et ' + decimalPart + ' centimes';
  }

  return result.trim();
};

export class DocumentService {
  //************************************ Appel d'offre **************************************** 
  static async generateAppelOffreDocument(appelOffre: AppelOffre): Promise<void> {
    try {

      // Préparer les données pour le template
      const data = {
        numOrdreAO: appelOffre.num_Ordre_AO || '',
        dateOuverturePli_AO: dayjs(appelOffre.dateOuverturePli_AO || '').format('DD/MM/YYYY'),
        heureOuverturePli_AO: appelOffre.heureOuverturePli_AO
        ? dayjs(appelOffre.heureOuverturePli_AO, 'HH:mm').isValid()
          ? dayjs(appelOffre.heureOuverturePli_AO, 'HH:mm').format('HH[h]mm')
          : 'Heure invalide'
        : 'Non spécifiée',        
        TypeAO: appelOffre.type_AO.toUpperCase() || '',
        typeAO: appelOffre.type_AO.toLowerCase() || '',
        idMarche: appelOffre.marche_AO_obj?.numOrdre || '',
        objetAO: appelOffre.marche_AO_obj?.objet_marche || '',
        coutEstimeAO: appelOffre.coutEstime_AO || 0,
        coutEstimeAOLetters: numberToWords(appelOffre.coutEstime_AO || 0),
        coutEstimeAONumeric: (appelOffre.coutEstime_AO || 0).toLocaleString('fr-FR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }),
        cautionProvisoireAO: appelOffre.cautionProvisoire_AO || 0,
        cautionProvisoireAOLetters: numberToWords(appelOffre.cautionProvisoire_AO || 0),
        cautionProvisoireAONumeric: (appelOffre.cautionProvisoire_AO || 0).toLocaleString('fr-FR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }),
      };

      // Générer le document sécurisé avec le template sécurisé
      await SecureDocumentService.generateSecureDocument(
        '/templates/AppelOffre.docx',
        data,
        `APPEL_OFFRE_${appelOffre.num_Ordre_AO}`
      );

    } catch (error: unknown) {
      // Gestion des erreurs sécurisées
      SecureDocumentService.handleSecurityError(error);
      throw new Error('Échec de génération du document sécurisé');
    }
  }

  //************************************ Notification **************************************** 
  static async generateNotificationDocument(notification: Notification): Promise<void> {
    try {
      const data = {
        numOrdreNOTIF: notification.numOrdre_NOTIF || '',
        numOrdreMarche: notification.marche_NOTIF_obj?.numOrdre || '',
        dateVisa_NOTIF: dayjs(notification.dateVisa_NOTIF).format('DD/MM/YYYY'),
        dateApprobation_NOTIF: dayjs(notification.dateApprobation_NOTIF).format('DD/MM/YYYY'),
        objetMarche: notification.marche_NOTIF_obj?.objet_marche || '',
        montantFinal: notification.marche_NOTIF_obj?.montantFinal,
        societe: notification.marche_NOTIF_obj?.societe_obj?.raisonSociale.toUpperCase() || '',
        delaisMarche: notification.marche_NOTIF_obj?.delaisMarche,
        montantFinalLetters: numberToWords(notification.marche_NOTIF_obj?.montantFinal || 0),
        montantFinalNumeric: (notification.marche_NOTIF_obj?.montantFinal || 0).toLocaleString('fr-FR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }),
      };

      // Générer le document sécurisé avec le template sécurisé
      await SecureDocumentService.generateSecureDocument(
        '/templates/NotificationApprobation.docx',
        data,
        `NOTIFICATION_${notification.numOrdre_NOTIF}`
      );

    } catch (error) {
      // Gestion des erreurs sécurisées
      SecureDocumentService.handleSecurityError(error);
    }
  }

//************************************ Ordre De Service **************************************** 
static async generateOrdreDeServiceDocument(ordreDeService: OrdreDeService): Promise<void> {
  try {

    const data = {
      numOrdreOS: ordreDeService.numOrdre_OS || '',
      idMarche: ordreDeService.idMarche_obj?.numOrdre || '',
      objetMarche: ordreDeService.idMarche_obj?.objet_marche || '',
      type_OS: ordreDeService.type_OS || '',
      nomSociete: ordreDeService.societe_obj?.raisonSociale || '',
      adresseSociete: ordreDeService.societe_obj?.adresse || '',
      date_OS: dayjs(ordreDeService.date_OS).format('DD/MM/YYYY'),
    };
    
    // Générer le document sécurisé avec le template sécurisé
    await SecureDocumentService.generateSecureDocument(
      '/templates/OrdreDeService.docx',
      data,
      `OrdreDeService_${ordreDeService.type_OS}_${ordreDeService.numOrdre_OS}`
    );

  } catch (error) {
    // Gestion des erreurs sécurisées
    SecureDocumentService.handleSecurityError(error);
  }
}

//************************************ PV De reception **************************************** 
static async generatePVDeReceptionDocument(PVDeReception: PvReception): Promise<void> {
  try {
    const data = {
      numOrdrePV: PVDeReception.id_PVR || '',
      objetMarche: PVDeReception.marche_PVR_obj?.objet_marche || '',
      idMarche: PVDeReception.marche_PVR_obj?.numOrdre || '',
      nomSociete: PVDeReception.marche_PVR_obj?.societe_obj?.raisonSociale || '',
      type_PVR: PVDeReception.type_PVR || '',
      chefDeProjet: PVDeReception.marche_PVR_obj?.chefServiceConcerne || '',
      serviceConcerne: PVDeReception.marche_PVR_obj?.serviceConcerne || '',
      date_PVR: dayjs(PVDeReception.date).format('DD/MM/YYYY')
      
    };
    console.log("Data envoyé au template :", data);

    // Générer le document sécurisé avec le template sécurisé
    await SecureDocumentService.generateSecureDocument(
      '/templates/PVR_DEFINITIF.docx',
      data,
      `PVDeReception_${PVDeReception.type_PVR}_${PVDeReception.id_PVR}`
    );

  } catch (error) {
    // Gestion des erreurs sécurisées
    SecureDocumentService.handleSecurityError(error);
  }
}
}