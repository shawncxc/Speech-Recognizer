import { createStore } from 'redux';

const listenerReducer = (state = {}, action) => {
  switch(action.type) {
    case 'LISTEN':
      return {
      	sound: action.sound,
      	speech: ''
      };
    case 'WRITE':
      return {
      	sound: '',
      	speech: action.speech
      };
    default:
      return '';
  }
};

export default createStore(listenerReducer);