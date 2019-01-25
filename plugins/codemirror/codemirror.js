
import Vue from 'vue';
import VueCodeMirror from '@/components/codemirror';

import 'codemirror/mode/cypher/cypher.js'
import 'codemirror/mode/javascript/javascript.js'
// theme css
import './neo.css'
//import 'codemirror/theme/neo.css'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/theme/base16-light.css'

Vue.use(VueCodeMirror);