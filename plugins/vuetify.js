import Vue from 'vue';
import Vuetify from 'vuetify';
import colors from 'vuetify/es5/util/colors';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify, {
    theme: {
        primary: colors.purple,
        secondary: colors.grey.darken1,
        accent: colors.shades.black,
        error: colors.red.accent3,
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
        ...colors
    },
    options: {
        customProperties: true
    }
});
