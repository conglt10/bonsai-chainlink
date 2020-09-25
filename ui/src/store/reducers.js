import * as connect from './actions';

const initialState = {
  web3: null,
  purses: [],
  plantsDict: [], // Empty array
  plants: [], // Fill bonsai in empty array to display
  walletAddress: null,
  balanceNative: null,
  balanceOxy: null,
  tourStep: 0,
  balanceBonsai: [],
  firstPlant: null, // for trigger transfer plant posotion
  loading: false,
  instanceBonsai: null,
  instanceOxygen: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case connect.SET_WEB3:
      return {
        ...state,
        web3: action.web3,
      };
    case connect.SET_ADDRESS:
      return {
        ...state,
        walletAddress: action.walletAddress,
      };
    case connect.CHANGE_PLANT_STATUS:
      return {
        ...state,
        plants: action.plants,
      };
    case connect.GET_BALANCE_NATIVE_TOKEN:
      return {
        ...state,
        balanceNative: action.balanceNative,
      };
    case connect.GET_BALANCE_OXY:
      return {
        ...state,
        balanceOxy: action.balanceOxy,
      };
    case connect.GET_BALANCE_BONSAI:
      return {
        ...state,
        plants: action.plants,
        balanceBonsai: action.balanceBonsai,
      };
    case connect.SET_PLANTS_DICT:
      return {
        ...state,
        plantsDict: action.plantsDict,
      };
    case connect.UPDATE_TOUR_STEP:
      return {
        ...state,
        tourStep: action.tourStep,
      };
    case connect.SET_FIRST_PLANT:
      return {
        ...state,
        firstPlant: action.firstPlant,
      };
    case connect.SET_LOADING:
      return {
        ...state,
        loading: action.loading,
      };
    case connect.SET_BONSAI_INSTANCE:
      return {
        ...state,
        instanceBonsai: action.instanceBonsai,
      };
    case connect.SET_OXYGEN_INSTANCE:
      return {
        ...state,
        instanceOxygen: action.instanceOxygen,
      };
    case connect.SET_LINK_INSTANCE:
      return {
        ...state,
        instanceLink: action.instanceLink,
      };
    case connect.SET_DAI_INSTANCE:
      return {
        ...state,
        instanceDai: action.instanceDai,
      };
    default:
      return state;
  }
};

export default rootReducer;
