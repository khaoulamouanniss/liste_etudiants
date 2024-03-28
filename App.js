import React, { useState, useEffect } from 'react';
import {View, Text, Modal, FlatList, StyleSheet, Alert } from 'react-native';
import EntreeTexte from './composants/EntreeTexte';
import Selecteur from './composants/Selecteur';
import Bouton from './composants/Bouton';
import Titre from './composants/Titre';
import coursDisponibles from './data/cours';  
import sessions from './data/sessions'; 

export default function App() {
  const [etudiants, setEtudiants] = useState([]);
  const [etudiantId, setEtudiantId] = useState('');
  const [etudiantSelectionne, setEtudiantSelectionne] = useState(null);
  const [sessionSelectionnee, setSessionSelectionnee] = useState('');
  const [coursSelectionne, setCoursSelectionne] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [erreur, setErreur] = useState('');
  const [confirmation, setConfirmation] = useState('');
  

  useEffect(() => {

    fetch('https://raw.githubusercontent.com/khaoulamouanniss/liste_etudiants/main/etudiants.json')
            .then(response => response.json())
            .then(data => {
              setEtudiants(data);
            })
            .catch(error => {
                setErreur("Erreur lors du chargement des étudiants.");
                console.error(error);
            });
    }
    /*const chargerEtudiants = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/khaoulamouanniss/liste_etudiants/main/etudiants.json');
        const data = response.json();
        console.log(response.json())
        console.log(data)
        setEtudiants(data);
      } catch (error) {
        setErreur("Erreur lors du chargement des étudiants.");
        console.error(error);
      }
    };

    chargerEtudiants();
  }*/, []);

  const verifierEtudiantExiste = (id) => {
    const etudiant = etudiants.find((etudiant) => etudiant.id_etudiant === id);
    if (!etudiant) {
      setErreur("ID étudiant inexistant!");
      return null;    
    } else {
      setErreur(`Étudiant : ${etudiant.nom}`); // Affiche le nom de l'étudiant
      setConfirmation("Veuillez confirmer votre sélection");
      return etudiant;
    }
  };

  const handleSelectionnerEtudiant = (id) => {
    const etudiant = verifierEtudiantExiste(id);
    if (etudiant == null) {
      setErreur("");
      setEtudiantSelectionne(null);
      //setConfirmation("Veuillez confirmer votre sélection");
    } else {
      setEtudiantSelectionne(etudiant);
      console.log(etudiantSelectionne);
      setErreur("");
      setConfirmation("Étudiant sélectionné");
      
    }
  };
  const handleEnregistrerCours = () => {
    if (!coursSelectionne) {
      setErreur("Aucun cours sélectionné");
      return;
    }
    if (etudiantSelectionne.cours.includes(coursSelectionne)) {
      setErreur("L'élève est déjà inscrit à ce cours");
      return;
    }
    if (etudiantSelectionne.cours.length >= 5) {
      setErreur("Un élève ne peut pas être inscrit à plus de 5 cours");
      return;
    }
    const nouvelEtudiant = {
      ...etudiantSelectionne,
      cours: [...etudiantSelectionne.cours, coursSelectionne],
      session: sessionSelectionnee
    };
  
    setEtudiants(etudiants.map((etudiant) => etudiant.id_etudiant === etudiantSelectionne.id_etudiant ? nouvelEtudiant : etudiant));
    setEtudiantSelectionne(nouvelEtudiant);
    setCoursSelectionne('');
    setErreur('');
  };
  

  const renderItem = ({ item }) => (
    <Text style={styles.itemList}>{item}</Text>
  );

  return (
    <View style={styles.container}>
      <Titre>INSCRIPTION AUX COURS</Titre>

      <View style={styles.section}>
        <EntreeTexte
          placeholder="ID de l'étudiant"
          value={etudiantId}
          onChangeText={(text) => {
            setEtudiantId(text);
            verifierEtudiantExiste(text);
          }}
        />
        <Text style={styles.messageErreur}>{erreur}</Text>
        <Bouton title="Sélectionner un étudiant" onPress={()=>handleSelectionnerEtudiant(etudiantId)}/>
  
  <Text style={styles.confirmation}>{confirmation}</Text>
      </View>

      {etudiantSelectionne && (
        <>
          <View style={styles.section}>
          <Selecteur
      selectedValue={sessionSelectionnee}
      onValueChange={setSessionSelectionnee}
      items={sessions}
    />
    <Selecteur
      selectedValue={coursSelectionne}
      onValueChange={setCoursSelectionne}
      items={coursDisponibles}
    />
              {erreur && <Text style={styles.messageErreur}>{erreur}</Text>}
              </View>
              <View style={styles.boutonContainer}>
        <Bouton title="Enregistrer" onPress={handleEnregistrerCours} />
        <Bouton title="Afficher" onPress={() => setModalVisible(true)} />
      </View>

      <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalContent}>
  <Text style={styles.modalText}>Informations de l'étudiant :</Text>
    {etudiantSelectionne && (
      <>
        <Text style={styles.modalText}>ID: {etudiantSelectionne.id_etudiant}</Text>
        <Text style={styles.modalText}>Nom: {etudiantSelectionne.nom}</Text>
        <Text style={styles.modalText}>Session: {etudiantSelectionne.session}</Text>
        <Text style={styles.modalText}>Cours inscrits:</Text>
        <FlatList
          data={etudiantSelectionne.cours}
          renderItem={({ item }) => <Text style={styles.modalText}>{item}</Text>}
          keyExtractor={(_, index) => String(index)}
        />
      </>
    )}
    <Bouton title="Fermer" onPress={() => setModalVisible(false)}/>

      
  </View>
</Modal>

    </>
  )}
</View>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
padding: 16,
backgroundColor: 'white',
},
section: {
marginVertical: 10,
// Autres styles pour la section
},
boutonContainer: {
flexDirection: 'row',
justifyContent: 'space-around',
// Autres styles pour le container de bouton
},
messageErreur: {
color: 'red',
// Autres styles pour le message d'erreur
},
itemList: {
// Styles pour les items de la liste
},
modalView: {
  margin: 20,
  backgroundColor: 'white',
  borderRadius: 20,
  padding: 35,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
// Autres styles pour la modal view
},
modalContent: {
  margin: 20,
  backgroundColor: '#f8f3f9', // Fond gris pâle
  borderRadius: 20,
  padding: 35,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 2, height: 1 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
},
modalText: {
  marginBottom: 15,
  textAlign: 'center',
  // Ajoutez d'autres styles pour embellir le texte
},
modalCloseButton: {
  backgroundColor: 'lightgrey', 
  padding: 10,
  borderRadius: 20,
  width: 100, // Taille ajustée pour le bouton
  alignItems: 'center',
},
modalCloseButtonText: {
  color: 'black',
  // Ajoutez d'autres styles pour le texte du bouton
},
confirmation: {
  color: 'black', // Texte en noir pour la confirmation
  // Ajoutez d'autres styles si nécessaire
},
// Ajoutez d'autres styles personnalisés si nécessaire
});
