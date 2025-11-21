import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Table } from 'antd';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { getMarches } from '../../services/MarcheService';
import { TypeMarche, StatutMarche, Marche } from '../../services/MarcheService';
import Sidebare from '../../components/Sidebar/Sidebar_CS';

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const { Title: AntTitle, Text } = Typography;

const Dashboard: React.FC = () => {
  const [marches, setMarches] = useState<Marche[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMarches();
        setMarches(data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Sidebare><div>Chargement...</div></Sidebare>;
  if (error) return <Sidebare><div>{error}</div></Sidebare>;

   
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

const typeMapping: { [key: string]: string } = {
  'TRAVAUX' : 'TRAVAUX',
  'FOURNITURE':'FOURNITURE',
  'PRESTATION_SERVICE':'PRESTATION_SERVICE'
};

  // Calcul des statistiques pour les cartes
  const totalMarches = marches.length;
  const totalMontant = marches.reduce((sum, marche) => sum + (marche.montantFinal || 0), 0);
  
  const marchesEnCours = marches.filter(marche => 
    statusMapping[marche.statut] === 'EnCoursExecution' || 
    statusMapping[marche.statut] === 'EnCoursTraitement' ||
    statusMapping[marche.statut] === 'EnCoursDeVisa' ||
    statusMapping[marche.statut] === 'EnCoursApprobation'
  ).length;

  const marchesTermines = marches.filter(marche => 
    statusMapping[marche.statut] === 'Acheve' || 
    statusMapping[marche.statut] === 'Cloture'
  ).length;

  // Statistiques par statut
  const statutStats = Object.values(StatutMarche)
    .filter(value => typeof value === 'number')
    .map((statut: any) => {
      const marchesByStatut = marches.filter(m => statusMapping[m.statut] === statusMapping[statut]);
      return {
        statut: StatutMarche[statut],
        count: marchesByStatut.length,
        montantTotal: marchesByStatut.reduce((sum, m) => sum + (m.montantFinal || 0), 0),
        delaisMoyen: calculateAverageDelai(marchesByStatut)
      };
    });

  // Statistiques par délai
  const marchesEnRetard = marches.filter(marche => {
    if (!marche.delaisMarche) return false;
    const delaiDate = new Date(marche.delaisMarche);
    return delaiDate < new Date() && 
           (statusMapping[marche.statut] === 'EncoursExecution' || 
            statusMapping[marche.statut] === 'EnCoursTraitement');
  }).length;

  // Préparation des données pour les graphiques
  const typeMarcheData = {
    labels: ['TRAVAUX', 'FOURNITURE', 'PRESTATION_SERVICE'],
    datasets: [{
      label: 'Nombre de marchés',
      data: [
        marches.filter(m => m.type_Marche === 'TRAVAUX').length,
        marches.filter(m => m.type_Marche === 'FOURNITURE').length,
        marches.filter(m => m.type_Marche === 'PRESTATION_SERVICE').length
      ],
      backgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0']
    }]
  };
  

  const statutMarcheData = {
    labels: Object.values(StatutMarche).map((statut: any) => statusMapping[statut]),
    datasets: [{
      label: 'Nombre de marchés',
      data: Object.values(StatutMarche).map((statut: any) => 
        marches.filter(m => statusMapping[m.statut] === statusMapping[statut]).length
      ),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
        '#9966FF', '#FF9F40', '#C7C7C7', '#5366FF',
        '#289F40', '#D2C7C7', '#4E34C7'
      ]
    }]
  };

  const delaisData = {
    labels: marches.map(m => m.numOrdre),
    datasets: [{
      label: 'Jours restants',
      data: marches.map(m => calculateDaysRemaining(m.delaisMarche)),
      backgroundColor: '#FF9F40',
      borderColor: '#FF9F40',
      tension: 0.1
    }]
  };

  // Colonnes pour le tableau des statuts
  const statutColumns = [
    {
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
    },
    {
      title: 'Nombre de marchés',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: 'Montant total (MAD)',
      dataIndex: 'montantTotal',
      key: 'montantTotal',
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: 'Délai moyen (jours)',
      dataIndex: 'delaisMoyen',
      key: 'delaisMoyen',
    },
  ];

  return (
    <Sidebare>
      <div style={{ padding: '20px' }}>
        <AntTitle level={2}>Tableau de bord des marchés</AntTitle>
        
        {/* Cartes de synthèse */}
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={6}>
            <Card title="Total des marchés" bordered={false}>
              <AntTitle level={2}>{totalMarches}</AntTitle>
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Montant total" bordered={false}>
              <AntTitle level={2}>{totalMontant.toLocaleString()} MAD</AntTitle>
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Marchés en cours" bordered={false}>
              <AntTitle level={2}>{marchesEnCours}</AntTitle>
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Marchés en retard" bordered={false}>
              <AntTitle level={2}>{marchesEnRetard}</AntTitle>
            </Card>
          </Col>
        </Row>

        {/* Graphiques */}
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={12}>
            <Card title="Répartition par type de marché">
              <Pie data={typeMarcheData} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Répartition par statut">
              <Bar 
                data={statutMarcheData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={24}>
            <Card title="Délais des marchés">
              <Line 
                data={delaisData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Jours restants'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Marchés'
                      }
                    }
                  }
                }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Card title="Détails par statut">
              <Table 
                columns={statutColumns}
                dataSource={statutStats}
                rowKey="statut"
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </Sidebare>
  );
};

// Fonctions utilitaires
function calculateDaysRemaining(delaisMarche: string): number {
  if (!delaisMarche) return 0;
  const delaiDate = new Date(delaisMarche);
  const today = new Date();
  const diffTime = delaiDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function calculateAverageDelai(marches: Marche[]): number {
  if (marches.length === 0) return 0;
  const total = marches.reduce((sum, marche) => {
    return sum + (calculateDaysRemaining(marche.delaisMarche) || 0);
  }, 0);
  return Math.round(total / marches.length);
}

export default Dashboard;