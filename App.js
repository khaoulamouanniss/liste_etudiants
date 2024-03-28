import React, { useState, useEffect } from 'react';
import {View, Text, Modal, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import {I18n} from 'i18n-js';
import * as Localization from 'expo-localization';
import trad from './js/traduction';
import EntreeTexte from './composants/EntreeTexte';
import Selecteur from './composants/Selecteur';
import Bouton from './composants/Bouton';
import Titre from './composants/Titre';
import coursDisponibles from './js/cours';  
import sessions from './js/sessions'; 

export default function App() {
  const [etudiants, setEtudiants] = useState([]);
  const [etudiantId, setEtudiantId] = useState('');
  const [etudiantSelectionne, setEtudiantSelectionne] = useState(null);
  const [sessionSelectionnee, setSessionSelectionnee] = useState('');
  const [coursSelectionne, setCoursSelectionne] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [erreur, setErreur] = useState({erreur1:'',erreur2:'',erreur3:''});
  const [langue, setLangue] = useState(Localization.getLocales()[0].languageCode);
  const [afficherOptionsLangue, setAfficherOptionsLangue] = useState(false);
  const optionsLangue = [
    { label: 'Arabe', value: 'ar' },
    { label: 'Français', value: 'fr' },
    { label: 'English', value: 'en' },
    
  ];
  const traduire = new I18n(trad); 
  traduire.locale = langue;  

  useEffect(() => {

    fetch('https://raw.githubusercontent.com/khaoulamouanniss/liste_etudiants/main/etudiants.json')
            .then(response => response.json())
            .then(data => {
              setEtudiants(data);
            })
            .catch(error => {
                setErreur({erreur1:"Erreur lors du chargement des étudiants."});
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
      setErreur({erreur1:"ID étudiant inexistant!"});
      return null;    
    } else {
      setErreur({erreur1:`Étudiant : ${etudiant.nom}`}); // Affiche le nom de l'étudiant
      setErreur({erreur2:"Veuillez confirmer votre sélection"});
      return etudiant;
    }
  };

  const handleSelectionnerEtudiant = (id) => {
    const etudiant = verifierEtudiantExiste(id);
    if (etudiant == null) {
      setErreur({erreur1:''});
      setEtudiantSelectionne(null);
      //setConfirmation("Veuillez confirmer votre sélection");
    } else {
      setEtudiantSelectionne(etudiant);
      console.log(etudiantSelectionne);
      setErreur({erreur1:''});
      setErreur({erreur1:"Étudiant sélectionné"});
      
    }
  };
  const handleEnregistrerCours = () => {
    if (!coursSelectionne) {
      setErreur({erreur3:"Aucun cours sélectionné"});
      return;
    }
    if (etudiantSelectionne.cours.includes(coursSelectionne)) {
      setErreur({erreur3:"L'étudiant est déjà inscrit à ce cours"});
      return;
    }
    if (etudiantSelectionne.cours.length >= 5) {
      setErreur({erreur3:"Un étudiant ne peut pas être inscrit à plus de 5 cours"});
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
    setErreur({erreur3:''});
  };
  

  const changerLangue = (langueSelectionnee) => {
    console.log("Changement de langue vers :", langueSelectionnee);      setLangue(langueSelectionnee);
    setAfficherOptionsLangue(false); 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => console.log('Test onPress')}>
  <Text>Test Click</Text>
</TouchableOpacity>
      <Titre>INSCRIPTION AUX COURS</Titre>

      <TouchableOpacity onPress={() => setAfficherOptionsLangue(!afficherOptionsLangue)} style={{ position: 'absolute', top: 80, right: 20 }}>
  <Text>{langue.toUpperCase()}</Text>
</TouchableOpacity>

{afficherOptionsLangue && (
  console.log('Rendu des options de langue'),
  <View style={styles.optionsLangueContainer}>
    {optionsLangue.map((option) => (
      <TouchableOpacity
        key={option.value}
        style={styles.optionLangue}
        onPress={() => {
          changerLangue(option.value); 
        }}
      >
        <Text style={styles.textOptionLangue}>{option.value.toUpperCase()}</Text>
      </TouchableOpacity>
    ))}
  </View>
)}

      <View style={styles.section}>
      

</View>

      <View style={styles.section}>
        <EntreeTexte
          placeholder="ID de l'étudiant"
          value={etudiantId}
          onChangeText={(text) => {
            setEtudiantId(text);
            verifierEtudiantExiste(text);
          }}
        />
        <Text style={styles.messageErreur}>{erreur.erreur1}</Text>
        <Bouton title="Sélectionner un étudiant" onPress={()=>handleSelectionnerEtudiant(etudiantId)}/>
  
  <Text style={styles.confirmation}>{erreur.erreur2}</Text>
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
              {erreur && <Text style={styles.messageErreur}>{erreur.erreur3}</Text>}
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
optionsLangueContainer: {
  position: 'absolute',
  top: 100, 
  right: 10,
  backgroundColor: 'white',
  borderRadius: 6,
  padding: 3,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},
optionLangue: {
  padding: 5,
},
textOptionLangue: {
  textAlign: 'center',
},
});
