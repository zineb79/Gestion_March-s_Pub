import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { AppelOffre } from '../services/AOService';
import { SecurityMonitor } from './SecurityMonitor';
import { Notification } from '../services/NotifApprService';
import { SECURITY_CONFIG } from './security.config';
import CryptoJS from 'crypto-js';

export class SecureDocumentService {
    private static async loadTemplate(templatePath: string): Promise<ArrayBuffer> {
      try {
        const response = await fetch(templatePath);
        if (!response.ok) throw new Error('Template inaccessible');
        
        const buffer = await response.arrayBuffer();
        this.verifyTemplateIntegrity(buffer);
        return buffer;
      } catch (error) {
        throw new Error(`Erreur lors du chargement du template: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }
  
    private static async verifyTemplateIntegrity(buffer: ArrayBuffer): Promise<void> {
        try {
          // Convertir en WordArray pour CryptoJS
          const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(buffer));
          const calculatedHash = CryptoJS.SHA3(wordArray, { outputLength: 256 }).toString();
          
          console.log('Hash calculé:', calculatedHash);
          console.log('Hash attendu:', SECURITY_CONFIG.TEMPLATE_HASH);
      
          if (!SECURITY_CONFIG.TEMPLATE_HASH) {
            console.warn('Aucun hash de template configuré - mode développement');
            return;
          }
      
          if (calculatedHash !== SECURITY_CONFIG.TEMPLATE_HASH) {
            throw new Error(`Template compromis - HASH invalide. 
              Calculé: ${calculatedHash}
              Attend: ${SECURITY_CONFIG.TEMPLATE_HASH}`);
          }
        } catch (error) {
          console.error('Erreur de vérification:', error);
          throw error;
        }
      }
  
    static async generateSecureDocument(
      templatePath: string,
      data: Record<string, any>,
      outputFilename: string
    ): Promise<void> {
      try {
        // 1. Chargement sécurisé
        const buffer = await this.loadTemplate(templatePath);
        const zip = new PizZip(buffer);

        // 2. Préparation des données
        const securedData = Object.entries(data).reduce((acc, [key, value]) => {
          acc[key] = typeof value === 'string' ? CryptoJS.AES.encrypt(value, SECURITY_CONFIG.ENCRYPTION_KEY).toString() : value;
          return acc;
        }, {} as Record<string, any>);

        // 3. Génération du document
        const doc = new Docxtemplater(zip, {
          parser: (tag) => ({
            get: (scope) => {
              const value = scope[tag];
              return typeof value === 'string' ? CryptoJS.AES.decrypt(value, SECURITY_CONFIG.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8) : value;
            }
          })
        });

        try {
          doc.render(securedData);
        } catch (error) {
          if (error instanceof Error && 'properties' in error) {
            const errorProperties = error as unknown as {
              properties: { errors: Array<{ properties: { placeholder: string } }> }
            };
            const missingPlaceholders = errorProperties.properties.errors.map(e => e.properties.placeholder);
            throw new Error(`Erreur de template: Placeholders manquants - ${missingPlaceholders.join(', ')}`);
          }
          throw error;
        }

        // 4. Protection du document final
        const output = doc.getZip().generate({
          type: 'uint8array',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });

        // 5. Téléchargement sécurisé
        const blob = new Blob([output], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        saveAs(blob, `SECURE_${outputFilename}_${Date.now()}.docx`);

      } catch (error) {
        this.handleSecurityError(error);
        throw new Error(`Échec de génération sécurisée: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }
  
    public static handleSecurityError(error: unknown): void {
      if (error instanceof Error) {
        console.error(`[SECURITY ERROR] ${error.message}`);
        // Envoyer l'alerte au système de monitoring
        SecurityMonitor.getInstance().reportIncident({
          type: 'DOCUMENT_GENERATION_FAILURE',
          details: error.stack
        });
      }
    }
  }

  // Extension pour les Appels d'Offre
export class AppelOffreSecureService extends SecureDocumentService {
    static async generateAppelOffre(appelOffre: AppelOffre): Promise<void> {
      const templateData = {
        ...appelOffre,
        montantChiffre: CryptoJS.AES.encrypt(appelOffre.coutEstime_AO?.toString() || '0', SECURITY_CONFIG.ENCRYPTION_KEY).toString(),
        dateSecurisee: CryptoJS.AES.encrypt(new Date().toISOString(), SECURITY_CONFIG.ENCRYPTION_KEY).toString()
      };
  
      await this.generateSecureDocument(
        '/templates/secure_ao_template.docx',
        templateData,
        `APPEL_OFFRE_${appelOffre.num_Ordre_AO}`
      );
    }
  }
  
  // Extension pour les Notifications
  export class NotificationSecureService extends SecureDocumentService {
    static async generateNotification(notification: Notification): Promise<void> {
      const templateData = {
        ...notification,
        detailsChiffres: CryptoJS.AES.encrypt(JSON.stringify({
          montant: notification.marche_NOTIF_obj?.montantFinal,
          delais: notification.marche_NOTIF_obj?.delaisMarche
        }), SECURITY_CONFIG.ENCRYPTION_KEY).toString()
      };
  
      await this.generateSecureDocument(
        '/templates/secure_notif_template.docx',
        templateData,
        `NOTIFICATION_${notification.numOrdre_NOTIF}`
      );
    }
  }