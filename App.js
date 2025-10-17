import {
  Text,
  TextInput,
  View,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';

const API_KEY = '774543476c431d618e50f6dd7bdfca84';

function dateToDay(date) {
  let newDate = '';
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  for (let i = 0; i < 10; i++) {
    newDate += date[i];
  }
  let dayNum = new Date(newDate);
  let day = dayNum.getDay() + 1;
  return days[day] || 'Sunday';
}

function dateToMonth(date) {
  let newDate = '';
  let months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  for (let i = 0; i < 10; i++) {
    newDate += date[i];
  }
  let monthNum = new Date(newDate);
  let month = monthNum.getMonth();
  return months[month] || 'January';
}

const Cell = (props) => {
  return (
    <View style={styles.cell}>
      <Text>{dateToDay(props.date)}</Text>
      <Image
        style={styles.cellImage}
        source={{
          uri: `https://openweathermap.org/img/wn/${props.img}@2x.png`,
        }}
      />
      <View>
        <Text style={{ textAlign: 'center', width: 80 }}>{props.weather}</Text>
        <Text style={{ textAlign: 'center' }}>
          {props.date.substring(11, 16)}
        </Text>
      </View>
      <Text>{props.temp_max} °C</Text>
    </View>
  );
};

const SearchBar = (props) => {
  return (
    <View style={styles.navContainer}>
      <Text style={{ marginRight: 15, color: '#FFFFFF', fontSize: 18 }}>
        Search:
      </Text>
      <TextInput
        style={styles.input}
        value={props.val}
        onChangeText={props.setVal}
      />
    </View>
  );
};

export default App = () => {
  const [isLoading, setLoading] = useState([]);
  const [data, setData] = useState([]);
  const [city, setCity] = useState('Hermosillo');

  const getData = async () => {
    const contr = new AbortController();
    const signal = contr.signal;
    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city.trim()}&units=metric&appid=${API_KEY}`,
          { signal: signal }
        );
        const json = await response.json();
        setData(json.list);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  useEffect(() => {
    let delay = setTimeout(() => {
      if (city.trim() !== '') {
        console.log('Buscar');
        getData();
      }
    }, 1000);

    return () => clearTimeout(delay);
  }, [city]);

  if (city.trim() == '') {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <SearchBar val={city} setVal={setCity} />
          <Text
            style={{
              marginHorizontal: 'auto',
              textAlign: 'center',
              color: '#ffffff',
              fontSize: 17,
            }}>
            {"Enter a city's name to see its weather forecast."}
          </Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  } else {
    return isLoading || data == undefined || data == null ? (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <SearchBar val={city} setVal={setCity} />
          <ActivityIndicator
            size="large"
            color="#ffffff"
            style={{ marginVertical: 20 }}
          />
          <Text
            style={{
              marginHorizontal: 'auto',
              textAlign: 'center',
              color: '#ffffff',
              fontSize: 16,
            }}>
            {
              'If it takes a long time to load data, check on your Internet connection.'
            }
          </Text>
        </SafeAreaView>
      </SafeAreaProvider>
    ) : (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <SearchBar val={city} setVal={setCity} />
          <View>
            <Text
              style={{
                fontSize: 20,
                textAlign: 'center',
                color: '#ffffff',
                marginTop: 5,
                marginBottom: 10,
              }}>
              {`${dateToDay(data[0].dt_txt)}, ${dateToMonth(
                data[0].dt_txt
              )} ${data[0].dt_txt.substring(8, 10)} ${data[0].dt_txt.substring(
                0,
                4
              )}`}
            </Text>
          </View>
          <View style={styles.firstData}>
            <Image
              style={styles.firstDataImage}
              source={{
                uri: `https://openweathermap.org/img/wn/${data[0].weather[0].icon}@2x.png`,
              }}
            />
            <View>
              <Text
                style={{ fontSize: 32, textAlign: 'center', color: '#ffffff' }}>
                {data[0].main.temp} °C
              </Text>
              <Text
                style={{ fontSize: 20, textAlign: 'center', color: '#ffffff' }}>
                {data[0].weather[0].description}
              </Text>
              <Text
                style={{ fontSize: 20, textAlign: 'center', color: '#ffffff' }}>
                {data[0].dt_txt.substring(11, 16)}
              </Text>
            </View>
          </View>
          <FlatList
            style={{ borderWidth: [2], borderColor: '#aaaaaa' }}
            data={data}
            keyExtractor={(item) => item.dt}
            renderItem={({ item }) => (
              <Cell
                date={item.dt_txt}
                weather={item.weather[0].description}
                temp_max={item.main.temp_max}
                img={item.weather[0].icon}
              />
            )}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#002288',
    height: '100%',
  },
  navContainer: {
    flexDirection: 'row',
    width: '90%',
    marginTop: 10,
    marginBottom: 15,
    marginHorizontal: 'auto',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  firstData: {
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    marginTop: 10,
    marginBottom: 30,
    marginHorizontal: 'auto',
    backgroundColor: '#eeeeee30',
    borderRadius: 15,
    shadowColor: 'black',
    shadowOff: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  input: {
    padding: 10,
    width: '80%',
    textAlign: 'left',
    backgroundColor: '#ffffff80',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOff: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cell: {
    flexDirection: 'row',
    padding: 10,
    margin: 2,
    backgroundColor: '#ffffff95',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    shadowColor: 'black',
    shadowOff: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cellImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowColor: 'black',
    shadowOff: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  firstDataImage: {
    width: 80,
    height: 80,
    marginHorizontal: 'auto',
    shadowColor: 'black',
    shadowOff: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
});
