import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar/Sidebar_Sec'
import './Accueil_Sec.css'
import { Marche } from '../services/MarcheService';

const statusMapping: { [key: string]: string } = {
  'all': 'all',
  'EnCoursTraitement': 'EnCoursTraitement',
  'Adjuge': 'Adjuge',
  'EnCoursDeVisa': 'EnCoursDeVisa',
  'EnCoursApprobation': 'EnCoursApprobation',
  'EnArret': 'EnArret',
  'EncoursExecution': 'EncoursExecution',
  'HorsDelaisMarche': 'HorsDelaisMarche',
  'HorsDelaisGarantie': 'HorsDelaisGarantie',
  'Acheve': 'Acheve',
  'Notifie': 'Notifie',
  'Cloture': 'Cloture'
};

import { getMarches } from '../services/MarcheService';

const Accueil_Sec = () => {
  const [marches, setMarches] = useState<Marche[]>([])
  const [filteredMarches, setFilteredMarches] = useState<Marche[]>([])
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMarches = async () => {
      try {
        const response = await getMarches()
        setMarches(response)
        setFilteredMarches(response)
      } catch (error) {
        console.error('Error fetching marchés:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMarches()
  }, [])

  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredMarches(marches)
    } else {
      const filtered = marches.filter(marche => {
        return marche.statut === (statusMapping[selectedStatus] as any)
      });
      setFilteredMarches(filtered)
    }
  }, [selectedStatus, marches])

  if (loading) {
    return (
      <Sidebar>
        <div className="content">
          <h1>Chargement des marchés...</h1>
        </div>
      </Sidebar>
    )
  }

  return (
    <Sidebar>
      <div className="content">
        <div className="headerAcc">
          <h1>Marchés</h1>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">Tous les statuts</option>
            <option value="EnCoursTraitement">En cours de traitement</option>
            <option value="Adjuge">Adjuge</option>
            <option value="EnCoursDeVisa">En cours de visa</option>
            <option value="EnCoursApprobation">En cours d'approbation</option>
            <option value="EnArret">En arrêt</option>
            <option value="EncoursExecution">En cours d'exécution</option>
            <option value="HorsDelaisMarche">Hors délai de marché</option>
            <option value="HorsDelaisGarantie">Hors délai de garantie</option>
            <option value="Acheve">Acheve</option>
            <option value="Notifie">Notifié</option>
            <option value="Cloture">Clôturé</option>
          </select>
        </div>
        <div className="marches-grid">
          {filteredMarches.length > 0 ? (
            filteredMarches.map((marche) => (
              <div key={marche.numOrdre} className="marche-card">
                <h3>{marche.numOrdre}</h3>
                <div className="details">
                  <p><strong>Date limite:</strong> {new Date(marche.delaisMarche).toLocaleDateString()}</p>
                  <p><strong>Objet:</strong> {marche.objet_marche}</p>
                  <p><strong>Service:</strong> {marche.serviceConcerne}</p>
                  {/* Ajoutez le statut pour débogage */}
                  <p><strong>Statut:</strong> {marche.statut}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Aucun marché trouvé avec ce statut</p>
          )}
        </div>
      </div>
    </Sidebar>
  )
}

export default Accueil_Sec