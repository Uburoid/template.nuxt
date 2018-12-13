import Vue from 'vue';
import Vuetify from 'vuetify';
import colors from 'vuetify/es5/util/colors';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify, {
    theme: {
        primary: '#2644ac',
        secondary: '#f6b93b',
        accent: '#d9e3ff',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
        ...colors
    },
    options: {
        customProperties: true
    }
});