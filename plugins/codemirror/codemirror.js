
import Vue from 'vue';
import VueCodeMirror from 'vue-codemirror';

import 'codemirror/mode/cypher/cypher.js'
import 'codemirror/mode/javascript/javascript.js'
// theme css
import './neo.css'
//import 'codemirror/theme/neo.css'
import 'codemirror/theme/base16-dark.css'

Vue.use(VueCodeMirror);