import {
  Platform,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import {useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {Input} from '@rneui/themed';
import LeaderboardList from '../components/LeaderboardList';


const Home = ({navigation}) => {
  const {getAllUsers} = useUser();
  const [inputText, setInputText] = useState('');
  const [users, setUsers] = useState({
    email: '',
    user_id: '',
    username: '',
  });
  const leaderboardFetch = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const res = await getAllUsers(token);
      const userss = [];
      for (let i = 0; i < res.length; i++) {
        userss[i] = res[i].username;
      }
      setUsers(userss);
    } catch (error) {
      console.log(error);
    }
  };
  const userFetch = () => {
    setUsers(users.filter(users => users.includes(inputText)));
    if (inputText === '') {
      leaderboardFetch();
    }
  };

  useEffect(() => {
    leaderboardFetch();
  }, []);

  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <Input style={styles.input}
        placeholder="Search for users here..."
        leftIcon={{name: 'search'}}
        onChangeText={(text) => setInputText(text)}
        onSelectionChange={userFetch}
      />
      <LeaderboardList navigation={navigation} data={users} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: '#2b2e3f',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    justifyContent: 'space-between',
  },
  input: {
    color: 'white',
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
