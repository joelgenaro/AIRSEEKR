import React, { Component } from 'react';
import {
  Alert,
  Button,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../Provider/Colorsfont';
import HomeList from './components/HomeList';
import { Languageprovider } from '../Provider/Languageprovider';
import { localStorage } from '../Provider/localStorageProvider';
import {
  msgProvider,
  msgTitle,
} from '../Provider/Messageconsolevalidationprovider/messageProvider';
import { config } from '../Provider/configProvider';
import { consolepro } from '../Provider/Messageconsolevalidationprovider/Consoleprovider';
import { apifuntion } from '../Provider/Apicallingprovider/apiProvider';

export default class HomeTicket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false,
      userDetail: null,
    };
  }

  async componentDidMount() {
    await this.authenticateSession();
    await this.gethomedata();
    this.props.navigation.addListener('focus', async () => {
      await this.authenticateSession();
      await this.gethomedata();
    });
  }

  //------------------Get All home Data---------------------------//
  gethomedata = async () => {
    let user_id = 0;
    let user_details = await localStorage.getItemObject('user_arr');
    if (user_details != null) {
      user_id = user_details.user_id;
      this.setState({
        user_id: user_details.user_id,
      });
    }

    let url = config.baseURL + 'home_data.php?user_id=' + user_id;
    consolepro.consolelog('url', url);
    apifuntion
      .getApi(url)
      .then(obj => {
        if (obj.success == 'true') {
          consolepro.consolelog('homedata', obj);

          (check_notification_num = obj.check_notification_num),
            (main_category_arr = obj.category_arr);
          config.content_arr = obj.content_arr;
          if (config.device_type == 'ios') {
            config.guest_status = obj.guest_status;
          } else {
            config.guest_status = false;
          }

          localStorage.setItemObject('user_arr', obj.user_details);
          console.log(obj, '-------------------------------');
          this.setState({
            category_arr: obj.category_arr,
            new_item: obj.all_product,
          });
        } else {
          if (
            obj.active_status == '0' ||
            obj.msg[config.language] == msgTitle.usernotexit[config.language]
          ) {
            config.checkUserDeactivate(this.props.navigation);
          } else {
            msgProvider.alert(
              msgTitle.information[config.language],
              obj.msg[config.language],
              false,
            );
          }
          return false;
        }
      })
      .catch(err => {
        consolepro.consolelog('err', err);
      });
  };

  seekingHandle = async () => {
    await this.authenticateSession();
    if (!this.state.isLoggedIn) {
      Alert.alert(
        'Confirm',
        'Please first login',
        [
          {
            text: msgTitle.cancel[0],
          },
          {
            text: msgTitle.ok[0],
            // onPress: () =>  this.btnPageLoginCall(),
            onPress: async () => {
              await localStorage.setItemObject('skip_status', 'no');
              this.props.navigation.navigate('Login');
            },
          },
        ],
        { cancelable: false },
      );
    } else {
      this.props.navigation.navigate('Newpost');
    }
  };

  postForSaleHandle = async () => {
    await this.authenticateSession();
    if (!this.state.isLoggedIn) {
      Alert.alert(
        'Confirm',
        'Please first login',
        [
          {
            text: msgTitle.cancel[0],
          },
          {
            text: msgTitle.ok[0],
            // onPress: () =>  this.btnPageLoginCall(),
            onPress: async () => {
              await localStorage.setItemObject('skip_status', 'no');
              this.props.navigation.navigate('Login');
            },
          },
        ],
        { cancelable: false },
      );
    } else {
      this.props.navigation.navigate('SalePost');
    }
  };

  authenticateSession = async () => {
    let skip_status = await localStorage.getItemObject('skip_status');
    let user_login = await localStorage.getItemObject('user_login');
    let user_details = await localStorage.getItemObject('user_arr');

    this.setState({
      isLoggedIn: user_login && user_details,
      userDetail: user_details,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView
          style={{ flex: 0, backgroundColor: Colors.theme_color1 }}
        />
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.theme_color1}
          hidden={false}
          translucent={false}
          networkActivityIndicatorVisible={true}
        />
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          <View style={styles.logo}>
            <Image
              style={styles.logoImage}
              source={require('../assets/Logo-Final_1024x1024.png')}
              resizeMode={'contain'}
              height={120}
              width={120}
            />
          </View>
          <View style={styles.body}>
            <View style={styles.homeList}>
              <HomeList {...this.props} />
            </View>

            <View style={styles.navButton}>
              <TouchableOpacity
                style={styles.button}
                onPress={this.seekingHandle}>
                <Text style={styles.buttonText}>
                  {Languageprovider.t('POSTWHATYOUARESEEKING', language_key)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonRight]}
                onPress={this.postForSaleHandle}>
                <Text style={styles.buttonText}>
                  {Languageprovider.t('POSTANITEMFORSALE', language_key)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.colorTicketItem, padding: 15 },
  body: { flex: 1 },
  homeList: { flex: 1, marginBottom: 5 },
  logo: { justifyContent: 'center', alignItems: 'center', height: 220 },
  logoImage: {
    flex: 1,
    height: 120,
    width: 120,
    alignSelf: 'center',
    marginTop: -15,
  },
  navButton: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.whiteColor,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '48.5%',
    height: 45,
  },
  buttonRight: {
    marginLeft: '4%',
  },
  buttonText: {
    textTransform: 'uppercase',
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.red_color,
    textAlign: 'center',
  },
});
