import {
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {useStockApi, useMedia, useTag} from '../hooks/ApiHooks';
import {useEffect, useState} from 'react';
import {Button, Icon} from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Slider} from '@rneui/base';

const StockBuy = ({navigation, route}) => {
  const {getCompany} = useStockApi();
  const {postMedia} = useMedia();
  const {postTag} = useTag();
  const item = route.params;
  const [price, setPrice] = useState(0.0);
  const [amount, setAmount] = useState(1);

  const parseStockFetch = async () => {
    const prices = [];

    try {
      const res = await getCompany(item['1. symbol']);

      for (let key in res['Time Series (Daily)']) {
        prices.push(res['Time Series (Daily)'][key]['1. open']);
      }

      setPrice(parseFloat(prices.slice(0, 1)[0]));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    parseStockFetch();
  }, []);

  const handleBuy = async () => {
    for (let i = 0; i < amount; i++) {
      const formData = new FormData();

      formData.append('title', item['2. name']);
      formData.append('description', price);
      formData.append('file', {
        uri: 'https://placekitten.com/200/300',
        name: 'kitten.jpg',
        type: 'image/jpg',
      });

      try {
        const token = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('user_id');

        const res = await postMedia(token, formData);
        const tag = {file_id: res.file_id, tag: userId};
        const tagRes = await postTag(token, tag);
      } catch (error) {
        console.log(error.message);
      }
    }

    Alert.alert(
      'Your order was succesful',
      `Your order of ${amount} ${item['2. name']} (${
        item['1. symbol']
      }), with the total sum of ${price * amount}${
        item['8. currency']
      } was succesful!`,
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Stocks');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <View
        style={{
          borderBottomColor: 'grey',
          borderBottomWidth: 1,
          marginBottom: 30,
          alignItems: 'center',
          flexDirection: 'row',
          paddingBottom: 30,
        }}
      >
        <View style={{marginLeft: 15}}>
          <Text
            style={{
              fontWeight: 'bold',
              color: '#c7fe61',
              fontSize: 20,
              marginBottom: 5,
            }}
          >
            Buy {item['1. symbol']}
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            {item['2. name']}
          </Text>
        </View>

        <Text
          style={{
            marginLeft: 'auto',
            marginRight: 15,
            fontSize: 25,
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          {price} {item['8. currency']}
        </Text>
      </View>

      <Text
        style={{
          color: '#c7fe61',
          alignSelf: 'center',
          fontSize: 15,
          padding: 20,
        }}
      >
        Market Open Between {item['5. marketOpen']}-{item['6. marketClose']} (
        {item['7. timezone']})
      </Text>

      <View style={{padding: 20, marginBottom: 10}}>
        <Text style={{fontSize: 20, color: 'white', paddingBottom: 10}}>
          Amount: {amount}
        </Text>
        <Slider
          value={amount}
          onValueChange={setAmount}
          maximumValue={10}
          minimumValue={1}
          step={1}
          allowTouchTrack
          trackStyle={{height: 5, backgroundColor: 'transparent'}}
          thumbStyle={{height: 20, width: 20, backgroundColor: 'transparent'}}
          thumbProps={{
            children: (
              <Icon
                size={15}
                reverse
                containerStyle={{bottom: 15, right: 15}}
                color="white"
              />
            ),
          }}
        />
      </View>

      <Text
        style={{
          fontSize: 20,
          color: 'white',
          paddingBottom: 40,
          alignSelf: 'center',
        }}
      >
        Total price of current order: {price * amount} {item['8. currency']}
      </Text>

      <Button
        size="lg"
        title="SET ORDER"
        containerStyle={{alignSelf: 'center'}}
        titleStyle={{fontWeight: 'bold', fontSize: 23, paddingHorizontal: 40}}
        buttonStyle={{
          borderRadius: 10,
          backgroundColor: '#118C4F',
        }}
        onPress={handleBuy}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: '#2b2e3f',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  title: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    paddingBottom: 30,
  },
  chart: {
    alignSelf: 'center',
    marginRight: 30,
  },
  input: {
    color: 'white',
  },
});

StockBuy.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default StockBuy;
