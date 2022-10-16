import {Platform} from 'react-native';
import Tips from 'react-native-root-tips';
import {colors} from '../../utils';
import RNFetchBlob from 'rn-fetch-blob';

export const FUNCAngkaToRupiah = (num = 0) => {
  var numx = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return numx;
};

export const FUNCToast = (status, {...obj}) => {
  if (status === 'SUCCESS') {
    Tips.showSuccess(obj.msg, {
      duration: obj.duration === undefined ? 2000 : obj.duration,
      position: Tips.positions.CENTER,
      shadow: false,
      animation: true,
      hideOnPress: false,
      mask: true,
      maskColor: colors.black,
      delay: 0,
    });
  }
  if (status === 'FAIL') {
    Tips.showFail(obj.msg, {
      duration: 2000,
      position: Tips.positions.CENTER,
      shadow: false,
      animation: true,
      hideOnPress: false,
      mask: true,
      maskColor: colors.black,
      delay: 0,
    });
  }
  if (status === 'WARN') {
    Tips.showWarn(obj.msg, {
      duration: obj.duration === undefined ? 2000 : obj.duration,
      position: Tips.positions.CENTER,
      shadow: false,
      animation: true,
      hideOnPress: false,
      mask: true,
      maskColor: colors.black,
      delay: 0,
    });
  }
  if (status === 'INFO') {
    Tips.showInfo(obj.msg, {
      duration: obj.duration === undefined ? 2000 : obj.duration,
      position: Tips.positions.CENTER,
      shadow: false,
      animation: true,
      hideOnPress: false,
      mask: true,
      maskColor: colors.black,
      delay: 0,
    });
  }
  if (status === 'LOADING') {
    Tips.showLoading(obj.msg, {
      duration: obj.duration === undefined ? 30000 : obj.duration,
      position: Tips.positions.CENTER,
      shadow: false,
      animation: true,
      hideOnPress: false,
      mask: true,
      maskColor: colors.black,
      delay: 0,
    });
  }
  if (status === 'HIDE') {
    Tips.hide();
  }
};

export const FUNCDateToString = date => {
  var Date = date.getDate();
  var Month = date.getMonth() + 1;
  var Year = date.getFullYear();
  if (Date < 10) Date = '0' + Date;
  if (Month < 10) Month = '0' + Month;
  return Date + '-' + Month + '-' + Year;
};

export const FUNCGetExtention = fileUrl => {
  return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
};

export const FUNCGetFileName = path => {
  let filename = path.substring(path.lastIndexOf('/') + 1, path.length);
  return filename;
};

export const FUNCConvertTimeDuration = s => {
  var m = Math.floor(s / 60);
  m = m >= 10 ? m : '0' + m;
  s = Math.floor(s % 60);
  s = s >= 10 ? s : '0' + s;
  var ret = m + ':' + s;
  return ret;
};

export const FUNCCurrentDateChat = () => {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  var hh = today.getHours();
  var menit = today.getMinutes();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (hh < 10) {
    hh = '0' + hh;
  }
  if (menit < 10) {
    menit = '0' + menit;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  today = dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + menit;
  return today;
};

export const FUNCGetExtentionYt = fileUrl => {
  return /[/]/.exec(fileUrl) ? /[^/]+$/.exec(fileUrl) : undefined;
};

export const FUNCDownloadFile = async fileUrl => {
  try {
    FUNCToast('LOADING', {msg: 'memuat file...'});
    let date = new Date();
    let FILE_URL = fileUrl;
    let file_ext = FUNCGetExtention(FILE_URL);

    file_ext = '.' + file_ext[0];

    const {config, fs} = RNFetchBlob;
    const RootDir = (await fs.dirs.PictureDir) + `/rnosrdxclean/`;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          '/rnosrdxclean_file_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'downloading file from rnosrdxclean...',
        notification: true,
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        FUNCToast('SUCCESS', {
          msg: `File Downloaded Successfully ${
            Platform.OS !== 'ios'
              ? '\n\n' + options.addAndroidDownloads.path
              : ''
          }`,
        });
      });
  } catch (e) {
    FUNCToast('WARN', {msg: `File Downloaded Error`});
  }
};

export const FUNCDownloadMultiFile = async data => {
  try {
    FUNCToast('LOADING', {msg: 'memuat file...'});
    var success = false;
    for (var i = 0; i < data.length; i++) {
      let date = new Date();
      const extention = data[i].split('.').pop();
      const {config, fs} = RNFetchBlob;
      const RootDir = (await fs.dirs.PictureDir) + `/rnosrdxclean/`;
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          path:
            RootDir +
            '/rnosrdxclean_file_' +
            Math.floor(date.getTime() + date.getSeconds() / 2) +
            '.' +
            extention,
          description: 'downloading file from rnosrdxclean...',
          notification: true,
          useDownloadManager: true,
        },
      };
      await config(options)
        .fetch('GET', data[i])
        .then(res => {
          success = true;
          console.log('data[i] > ', data[i]);
        });
    }
    if (success) FUNCToast('SUCCESS', {msg: `File Downloaded Successfully`});
  } catch (e) {
    FUNCToast('WARN', {msg: `File Downloaded Error`});
  }
};

export const FUNCConvertDateDmyToYmd = date => {
  var slicedd = date.slice(0, 2);
  var slicemm = date.slice(3, 5);
  var sliceyy = date.slice(6, 10);
  return sliceyy + '-' + slicemm + '-' + slicedd;
};

export const FUNCIsImage = filename => {
  var isTrue = false;
  var extention = /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  if (extention !== undefined) {
    var realExtention = extention[0].toLowerCase();
    if (realExtention === 'jpg') isTrue = true;
    if (realExtention === 'jpeg') isTrue = true;
    if (realExtention === 'png') isTrue = true;
  }
  return isTrue;
};
