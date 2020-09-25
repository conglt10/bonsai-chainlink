import {
  getBalanceNativeToken,
  getBalanceERC721,
  getBalanceERC20,
  refundERC20To,
  mintERC721To,
  getPlantDict,
  setPlantDict,
  buyOxygenWithERC20,
} from 'helpers';
import { PLANT_STATUS, plantsInitDic } from 'constant';

export const SET_WEB3 = 'SET_WEB3';
export const setWeb3 = (web3) => async (dispatch) => {
  dispatch({
    type: SET_WEB3,
    web3,
  });
};

export const SET_BONSAI_INSTANCE = 'SET_BONSAI_INSTANCE';
export const setBonsaiInstance = (instanceBonsai) => async (dispatch) => {
  dispatch({
    type: SET_BONSAI_INSTANCE,
    instanceBonsai,
  });
};

export const SET_OXYGEN_INSTANCE = 'SET_OXYGEN_INSTANCE';
export const setOxygenInstance = (instanceOxygen) => async (dispatch) => {
  dispatch({
    type: SET_OXYGEN_INSTANCE,
    instanceOxygen,
  });
};

export const SET_LINK_INSTANCE = 'SET_LINK_INSTANCE';
export const setLinkInstance = (instanceLink) => async (dispatch) => {
  dispatch({
    type: SET_LINK_INSTANCE,
    instanceLink,
  });
};

export const SET_DAI_INSTANCE = 'SET_DAI_INSTANCE';
export const setDaiInstance = (instanceDai) => async (dispatch) => {
  dispatch({
    type: SET_DAI_INSTANCE,
    instanceDai,
  });
};

export const SET_ADDRESS = 'SET_ADDRESS';
export const setAddress = (walletAddress) => (dispatch) => {
  dispatch({
    type: SET_ADDRESS,
    walletAddress,
  });
};

export const CHANGE_PLANT_STATUS = 'CHANGE_PLANT_STATUS';
export const changePlantStatus = (id, status) => (dispatch, getState) => {
  let state = getState();

  let plants = state.plants;
  plants[id].plantStatus = status;
  dispatch({
    type: CHANGE_PLANT_STATUS,
    plants,
  });
};

export const RESET_ALL = 'RESET_ALL';
export const resetAll = () => (dispatch) => {
  dispatch({
    type: RESET_ALL,
  });
};

export const GET_BALANCE_NATIVE_TOKEN = 'GET_BALANCE_NATIVE_TOKEN';
export const getBalanceNative = (address) => async (dispatch, getState) => {
  let state = getState();
  let web3 = state.web3;
  const balanceNative = await getBalanceNativeToken(web3, address);
  dispatch({
    type: GET_BALANCE_NATIVE_TOKEN,
    balanceNative,
  });
};

export const GET_BALANCE_OXY = 'GET_BALANCE_OXY';
export const getBalanceOxy = () => async (dispatch, getState) => {
  let state = getState();
  const amount = await getBalanceERC20(state);
  dispatch({
    type: GET_BALANCE_OXY,
    balanceOxy: amount,
  });
};

export const SET_PLANTS_DICT = 'SET_PLANTS_DICT';
export const GET_BALANCE_BONSAI = 'GET_BALANCE_BONSAI';
export const getBalanceBonsai = () => async (dispatch, getState) => {
  let state = getState();
  const address = state.walletAddress;
  const instanceBonsai = state.instanceBonsai;
  const balanceBonsai = await getBalanceERC721(address, instanceBonsai);
  let plantsDict = await getPlantDict(instanceBonsai, address);
  plantsDict = plantsDict ? JSON.parse(plantsDict) : undefined;
  // if this is first time plants in contract is undefined
  if (plantsDict === undefined) {
    plantsDict = JSON.parse(JSON.stringify(plantsInitDic));
    plantsDict = Object.values(plantsDict);
  }
  // copy plantDict
  let plants = JSON.parse(JSON.stringify(plantsDict));

  // if not error
  if (balanceBonsai) {
    balanceBonsai.forEach((name, index) => {
      var x;
      // if not found plant.name in plants index return -1
      if ((x = plants.findIndex((plant) => plant.name === name['name'])) !== -1) {
        plants[x].plantStatus = PLANT_STATUS.PLANTED;
        plants[x].id = balanceBonsai[index]['id'];
      }
    });
  } else {
    alert('Try again!');
  }

  plants = Object.values(plants);
  plants.map((plant, index) => (plant.index = index));

  dispatch({
    type: SET_PLANTS_DICT,
    plantsDict,
  });

  dispatch({
    type: GET_BALANCE_BONSAI,
    plants,
    balanceBonsai: balanceBonsai,
  });
};

export const UPDATE_TOUR_STEP = 'UPDATE_TOUR_STEP';
export const updateTourStep = (tourStep) => (dispatch) => {
  dispatch({
    type: UPDATE_TOUR_STEP,
    tourStep,
  });
};

export const SET_FIRST_PLANT = 'SET_FIRST_PLANT';
export const setFirstPlant = (firstPlant) => (dispatch) => {
  dispatch({
    type: SET_FIRST_PLANT,
    firstPlant,
  });
};

export const transferPlantLocation = (secondPlant) => async (dispatch, getState) => {
  let { firstPlant, plantsDict, plants, walletAddress, web3, instanceBonsai } = getState();

  // transfer in empty array
  let temp = plants[firstPlant];
  plants[firstPlant] = plants[secondPlant];
  plants[secondPlant] = temp;

  plants.map((plant, index) => (plant.index = index));

  dispatch({
    type: CHANGE_PLANT_STATUS,
    plants,
  });

  // transfer in empty array
  temp = plantsDict[firstPlant];
  plantsDict[firstPlant] = plantsDict[secondPlant];
  plantsDict[secondPlant] = temp;

  // update index
  plantsDict.map((plant, index) => (plant.index = index));
  await setPlantDict(web3, instanceBonsai, plantsDict, walletAddress);

  dispatch({
    type: SET_PLANTS_DICT,
    plantsDict,
  });
};

export const refundOxygen = (amount) => async (dispatch, getState) => {
  let { web3, instanceOxygen, walletAddress } = getState();
  await refundERC20To(web3, instanceOxygen, walletAddress, amount);
};

export const mintBonsai = (address, bonsai) => async (dispatch, getState) => {
  let { web3, instanceBonsai } = getState();
  const success = await mintERC721To(web3, instanceBonsai, address, bonsai);
  dispatch(setLoading(false));
  if (success) {
    dispatch(getBalanceBonsai());
    dispatch(getBalanceOxy());
  } else {
    dispatch(refundOxygen(bonsai.price));
  }
};

export const SET_LOADING = 'SET_LOADING';
export const setLoading = (loading) => (dispatch) => {
  dispatch({
    type: SET_LOADING,
    loading,
  });
};

export const buyOxygenERC = (tokenType, tokenPrice, price) => async (dispatch, getState) => {
  let state = getState();
  await buyOxygenWithERC20(state, tokenType, tokenPrice, price);
  dispatch(getBalanceOxy());
};
