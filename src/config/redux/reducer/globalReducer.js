const initialState = {
  formGlobal: {
    VisibleMenuBottom: true, //1621012087
    PencarianProduk: '',
    gerakin: false,
    tutupBtn: false,
    seconds: 0,
  },
  dataNotifikasis: false,
};

const globalReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FORM_GLOBAL':
      return {
        ...state,
        formGlobal: {
          ...state.formGlobal,
          [action.formType]: action.formValue,
        },
      };
    case 'DATA_NOTIFIKASIS':
      return {...state, dataNotifikasis: action.payload};
    default:
      return state;
  }
};

export default globalReducer;
