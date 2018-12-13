
const { Base } = require('./base');
const FormData = require('form-data');
const moment = require('moment');


class Analytics extends Base {
    constructor(...args) {
        super(...args);
    }

    async objectMarket({ layer_id, project = 0, date }) {
        
        let url = `deals.json?act=market&layerId=${layer_id}&project=${project}&date${date}`;

        let response = await this.api.get(url, {
            headers: {
                'x-token': this.payload.token
            }
        });

        console.log('Analytics.objectMarket');

        let { content } = response.data;

        return content;
    }

    async objectDeals({ layer_id, project = 0, date }) {
        
        let url = `deals.json?act=objects&layerId=${layer_id}&project=${project}&date=${date}`;

        let response = await this.api.get(url, {
            headers: {
                'x-token': this.payload.token
            }
        });

        console.log('Analytics.objectDeals');

        let { content } = response.data;

        return content;
    }

    async objectDetails({ object_id, project = 0 }) {
        

        let url = `analytics.json?act=details&objectId=${object_id}&project=${project}`;

        let response = await this.api.get(url, {
            headers: {
                'x-token': this.payload.token
            }
        });

        console.log('Analytics.objectDetails');

        let { content } = response.data;

        return content;
    }

    async irnDetails({ irn_short, irn_type, irn_reg, irn_room }) {
        let params = Object.entries({ irn_short, irn_type, irn_reg, irn_room }).reduce((memo, entry) => {
            let [key, value] = entry;

            value && memo.push(`${key}=${value}`);

            return memo;
        }, []);

        let url = `analytics.json?act=irn-details&${params.join('&')}`;

        let response = await this.api.get(url, {
            headers: {
                'x-token': this.payload.token
            }
        });

        console.log('Analytics.irnDetails');

        let { content } = response.data;

        return content;
    }

    async stages() {
        if(!(this.payload && this.payload.token)) return { redirect: '/' };

        try {
            let response = await this.api.get('analytics.json?act=stages', {
                headers: {
                    'x-token': this.payload.token
                }
            });

            console.log('Analytics.stages');
    
            let { content } = response.data;

            return content;
        }
        catch(err) {
            console.log('Analytics.stages ERROR', err);
            return { redirect: '/' }
        }
    }

    async filters() {
        if(!(this.payload && this.payload.token)) return { redirect: '/' };

        try {
            let response = await this.api.get('analytics.json?act=filters', {
                headers: {
                    'x-token': this.payload.token
                }
            });

            console.log('Analytics.filters');
    
            let { content } = response.data;

            return content;
        }
        catch(err) {
            console.log('Analytics.filters ERROR', err);
            return { redirect: '/' }
        }
    }

    async indicators() {
        if(!(this.payload && this.payload.token)) return { redirect: '/' };

        try {
            let response = await this.api.get('analytics.json?act=irn', {
                headers: {
                    'x-token': this.payload.token
                }
            });

            console.log('Analytics.indicators');
    
            let { content } = response.data;

            return content;
        }
        catch(err) {
            console.log('Analytics.indicators ERROR', err);
            return { redirect: '/' }
        }
    }
    
    async renovation() {
        if(!(this.payload && this.payload.token)) return { redirect: '/' };

        try {
            let response = await this.api.get('renovation/all', {
                headers: {
                    'x-token': this.payload.token
                }
            });
            
            return response.data;
        }
        catch(err) {
            console.log('Analytics.renovation ERROR', err);
            return { redirect: '/' }
        }
    }
    
    async balloon({ objectId, project = 0 }) {
        if (!(this.payload && this.payload.token))
          return { redirect: '/' };

        try {
            let response = await this.api.get(`analytics.json?act=balloon&project=${project}&objectId=${objectId}`, {
                headers: {
                    'x-token': this.payload.token
                }
            });
            
            return response.data.content;
        }
        catch(err) {
            console.log('Analytics.renovation ERROR', err);
            return { redirect: '/' }
        }
    }
    
    async perspectiveProjects() {
        if (!(this.payload && this.payload.token)) return { redirect: '/' };

        try {
            let response = await this.api.get(`perspective-projects/all`, {
                headers: {
                    'x-token': this.payload.token
                }
            });
            
            return response.data;
        }
        catch(err) {
            console.log('Analytics.perspectiveProjects ERROR', err);
            return { redirect: '/' }
        }
    }

    async pivotPrepared({ filters, ignore_cache } = {}) {
        let params = JSON.stringify({ filters });
        let key = `analytics.pivotPrepared:${this.payload.token}:${params}`;

        let info = this.cache.get(key);

        if(!info || ignore_cache) {
            if(filters) {
                filters = Object.entries(filters).map(entry => {
                    let [key, value] = entry;
                    
                    return `${key}=${value}`;
                });
    
                filters = encodeURI(filters.join('&'));
            }
    
            let url = filters ? `analytics.json?act=table&${filters}` : 'analytics.json?act=table'
    
            let response = await this.api.get(url, {
                headers: {
                    'x-token': this.payload.token
                }
            });
    
            console.log('Analytics.pivotPrepared');
    
            let { content: { columns, data } } = response.data;
            
            columns = columns.reduce((memo, column) => {
                !(['metrPriceRMin', 'metrPriceRAvg', 'metrPriceRMax'].includes(column.data)) && memo.push(column);

                return memo;
            }, [])


            columns.push(
                {
                    data: 'expo',
                    isSystem: 0,
                    name: 'expo',
                    order: 36,
                    title: 'Кол-во в продаже, шт.',
                    visible: true
                },
                {
                    data: 'squareAll',
                    isSystem: 0,
                    name: 'squareAll',
                    order: 36,
                    title: 'Общая площадь в продаже, кв. м',
                    visible: true
                },
                {
                    data: 'squareMin',
                    isSystem: 0,
                    name: 'squareMin',
                    order: 36,
                    title: 'Мин. площадь в продаже, кв.м',
                    visible: true
                },
                {
                    data: 'squareAvg',
                    isSystem: 0,
                    name: 'squareAvg',
                    order: 36,
                    title: 'Ср. площадь в продаже, кв.м',
                    visible: true
                },
                {
                    data: 'squareMax',
                    isSystem: 0,
                    name: 'squareMax',
                    order: 36,
                    title: 'Макс. площадь в продаже, кв.м',
                    visible: true
                },
                {
                    data: 'sumRmin',
                    isSystem: 0,
                    name: 'sumRmin',
                    order: 36,
                    title: 'Мин. бюджет покупки, руб.',
                    visible: true
                },
                {
                    data: 'sumRavg',
                    isSystem: 0,
                    name: 'sumRavg',
                    order: 36,
                    title: 'Ср. бюджет покупки, руб.',
                    visible: true
                },
                {
                    data: 'sumRmax',
                    isSystem: 0,
                    name: 'sumRmax',
                    order: 36,
                    title: 'Макс. бюджет покупки, руб.',
                    visible: true
                },
                {
                    data: 'square_all',
                    isSystem: 0,
                    name: 'square_all',
                    order: 36,
                    title: 'Общая площадь в продаже, кв.м по корпусу',
                    visible: true
                },
                {
                    data: 'square_min',
                    isSystem: 0,
                    name: 'square_min',
                    order: 36,
                    title: 'Мин. площадь в продаже, кв.м по корпусу',
                    visible: true
                },
                {
                    data: 'square_avg',
                    isSystem: 0,
                    name: 'square_avg',
                    order: 36,
                    title: 'Ср. площадь в продаже, кв.м по корпусу',
                    visible: true
                },
                {
                    data: 'square_max',
                    isSystem: 0,
                    name: 'square_max',
                    order: 36,
                    title: 'Макс. площадь в продаже, кв.м по корпусу',
                    visible: true
                },
                {
                    data: 'rooms',
                    isSystem: 0,
                    name: 'rooms',
                    order: 36,
                    title: 'Кол-во по корпусу, шт.',
                    visible: true
                },
                {
                    data: 'metrPriceRMin',
                    isSystem: 0,
                    name: 'metrPriceRMin',
                    order: 36,
                    title: 'Мин. цена кв.м. руб.',
                    visible: true
                },
                {
                    data: 'metrPriceRAvg',
                    isSystem: 0,
                    name: 'metrPriceRAvg',
                    order: 36,
                    title: 'Ср. цена кв.м. руб.',
                    visible: true
                },
                {
                    data: 'metrPriceRMax',
                    isSystem: 0,
                    name: 'metrPriceRMax',
                    order: 36,
                    title: 'Макс. цена кв.м. руб.',
                    visible: true
                },

            );

            const lot_types = ['6. Свободная планировка', '2. 1-комнатные лоты', '3. 2-комнатные лоты', '4. 3-комнатные лоты', '5. 4-комнатные лоты', '1. Студии'];

            const groups = {
                'sumRavg': {
                    name: 'Диапазон бюджетов покупки',
                    ranges: [
                        {range: [0, 3 * 1000000], name: '1. 0-3 МЛН РУБ.', sort: 1},
                        {range: [3 * 1000000, 5 * 1000000], name: '2. 3-5 МЛН РУБ.', sort: 2},
                        {range: [5 * 1000000, 10 * 1000000], name: '3. 5-10 МЛН РУБ.', sort: 3},
                        {range: [10 * 1000000, 15 * 1000000], name: '4. 10-15 МЛН РУБ.', sort: 4},
                        {range: [15 * 1000000, 25 * 1000000], name: '5. 15-25 МЛН РУБ.', sort: 5},
                        {range: [25 * 1000000, 50 * 1000000], name: '6. 25-50 МЛН РУБ.', sort: 6},
                        {range: [50 * 1000000, Infinity], name: '7. Более 50 МЛН РУБ.', sort: 7}
                    ]
                },
                'metrPriceRAvg': {
                    name: 'Диапазон цен за метр',
                    ranges: [
                        {range: [0, 50 * 1000], name: '1. до 50 тыс руб', sort: 1},
                        {range: [50 * 1000, 100 * 1000], name: '2. 50-100 тыс руб', sort: 2},
                        {range: [100 * 1000, 150 * 1000], name: '3. 100-150 тыс руб', sort: 3},
                        {range: [150 * 1000, 200 * 1000], name: '4. 150-200 тыс руб', sort: 4},
                        {range: [200 * 1000, 250 * 1000], name: '5. 200-250 тыс руб', sort: 5},
                        {range: [250 * 1000, 300 * 1000], name: '6. 250-300 тыс руб', sort: 6},
                        {range: [300 * 1000, Infinity], name: '7. Более 300 тыс руб', sort: 7}
                    ]
                }
            };

            data = data.reduce((acc, row) => {
                //debugger
                let { apart_0, apart_1, apart_2, apart_3, apart_4, apart_st, apart_total, b: { apart_0: b_apart_0, apart_1: b_apart_1, apart_2: b_apart_2, apart_3: b_apart_3, apart_4: b_apart_4, apart_st: b_apart_st }, ...common } = row;

                let lot_aparts = { apart_0, apart_1, apart_2, apart_3, apart_4, apart_st };
                let building_aparts = { b_apart_0, b_apart_1, b_apart_2, b_apart_3, b_apart_4, b_apart_st };
                
                let { living_square, metrPriceRAvg, metrPriceRMax, metrPriceRMin, ...rest } = common;

                let lots = Object.entries(lot_aparts).reduce((memo, entry, inx) => {
                    let [key, value] = entry;

                    let row = {
                        'Тип лота': lot_types[inx]
                    };

                    if(building_aparts[`b_${key}`].rooms || value.expo) {
                        row = { ...value, ...building_aparts[`b_${key}`], ...row, ...rest };

                        row = Object.entries(row).reduce((acc, entry) => {
                            let [key, value] = entry;

                            if(value) {
                                if(!isNaN(value)) {
                                    value = Number(value);
                                }
                                /* else {
                                    let reg = /^[0-9]{4}-[0-9]{2}-[0-9]{2}.*$/g;
                                    if(reg.test(value)) {
                                        let date = new Date(value);
                                        let date_value = date.valueOf()
                                        !isNaN(date_value) && (value = date);
                                    }
                                }; */

                                acc[key] = value;
                            }
                            

                            return acc;
                        }, {});

                        Object.entries(groups).forEach(entry => {
                            let [key, value] = entry;

                            if(row[key]) {
                                let test_value = row[key];
                                let range_name = void 0;

                                let in_range = value.ranges.some(entity => {
                                    let [min, max] = entity.range;
                                    range_name = entity.name;

                                    return min <= test_value && test_value <= max;
                                });

                                in_range && (row[value.name] = range_name);
                            }

                            row[value.name] = row[value.name] || value.ranges[0].name;
                        });

                        row['square_all'] = row['rooms'] * row['square_avg'];

                        row = Object.entries(row).reduce((memo, entry) => {
                            let [key, value] = entry;

                            let column = columns.find(column => column.data === key);
                            //let column = void 0;
                            key = column ? column.title : key;

                            key = key.replace(/\./g, '');
                            
                            ((column && column.data === 'project') || (column && !Number(column.is_system)) || (!column)) && (memo[key] = value);

                            return memo;
                        }, {});

                        memo.push(row);
                    }

                    return memo;
                }, []);

                

                //console.log(lots, common);
                acc = [...acc, ...lots];

                return acc;
            }, []);

            this.cache.set(key, data || []);

            return data || []
        }
        
        return info;
    }

    async raw() {
        let key = `analytics.raw:${this.payload.token}`;

        let info = this.cache.get(key);

        if(!info) {
            let url = 'analytics.json?act=table'
    
            let response = await this.api.get(url, {
                headers: {
                    'x-token': this.payload.token
                }
            });
    
            console.log('Analytics.raw');
    
            let { content } = response.data;
            //let { content: { columns, data } } = response.data;
            
            this.cache.set(key, content || []);

            return content || {}
        }
        
        return info;
    }

    async getPriceLink({ building_id, layout_time, resource_id }) {
            let url = `https://api.best-novostroy.ru/cmap/export/price?bId=${building_id}&rId=${resource_id}&layout=${layout_time}&token=${this.payload.token}`;
    
            return url;
    }

    async getDealsLink({ project = 0, object_id, date }) {
            let url = `https://api.best-novostroy.ru/cmap/export/deals?project=${project}&objectId=${object_id}&date=${date}&token=${this.payload.token}`;
            return url;
    }

    async get({ filters, map_columns = true, date, type, ignore_cache = false } = {}) {
        let params = JSON.stringify({ filters, map_columns, date, type });
        let key = `analytics.get:${this.payload.token}:${params}`;

        let info = this.cache.get(key);

        if(!info || ignore_cache) {
            if (filters) {
                filters = Object.entries(filters).map(entry => {
                    let [key, value] = entry;
                    
                    return `${key}=${value}`;
                });
    
                filters = encodeURI(filters.join('&'));
            }
            
            
            
            let url = filters ? `analytics.json?act=table&${filters}` : 'analytics.json?act=table'
  
            if (date && moment().diff(moment(date), 'days') > 0) {
                url = url.concat(encodeURI(`&date=${date} 23:59:59`))
            }
            
            if (type === 'projects') {
                url = url.concat(encodeURI(`&project=1`))
            }
    
            let response = await this.api.get(url, {
                headers: {
                    'x-token': this.payload.token
                }
            });
    
            console.log('Analytics.get');
    
            let { content: { columns, data = []} } = response.data;
            
            //this.cache.set(`columns:${this.payload.token}`, columns);

            if (map_columns) {
                data = data.map(item => {
                    const map = (item, pk) => Object.entries(item).reduce((memo, entry) => {
                        let [key, value] = entry;
                        
                        key = pk ? `${pk}.${key}` : key;
    
                        value = value && typeof(value) === 'object' ? map(value, key) : value;
    
                        let isDate = false;

                        if(isNaN(value)) {
                            /* let date = new Date(value);
                            if(!isNaN(date.valueOf())) {
                                value = date.valueOf();
                                isDate = true;
                            } */
                        }
                        else {
                            value && (value = Number(value));
                        }

                        /* try {
                            let date = new Date(value);

                            value = date;
                        }
                        catch(err) {

                        }

                        value = value ? isNaN(value) ? value : Number(value) : value; */
                        //value = value ? isNaN(value) ? isNaN(new Date(value).valueOf()) ? value : new Date(value) : Number(value) : value;

                        //value = isNaN(value) ? value : Number(value);
                        //value = typeof(value) === 'string' ? value : isNaN(value) ? value : Number(value);
    
                        let column = columns.find(column => column.data === key);
                        //let column = void 0;
                        key = column ? column.title : key;
    
                        key = key.replace(/\./g, '');
                        
                        isDate && (key = `date_${key}`);
    
                        //entry = column ? memo[column.title] = value : memo[key] = value;
        
                        if(column) {
                            Number(column.is_system) === 1 ? memo[`$${key}`] = value : memo[key] = value;
                        }
                        else {
                            typeof(value) === 'object' && (memo[key] = value);
                        }

                        return memo;
                    }, {});

                    let mapedItem = map(item);

                    const plain = (item) => Object.entries(item).reduce((memo, entry) => {
                        let [key, value] = entry;
                        
                        value && typeof(value) === 'object' ? memo = { ...memo, ...plain(value) } : memo[key] = value;

                        return memo;
                    }, {});
  
                    mapedItem = plain(mapedItem);
  
                    mapedItem.$origin = item;
        
                    return mapedItem;
                });
            }
    
            this.cache.set(key, { data, columns } || {});
            this.cache.set(`columns:${this.payload.token}`, columns);

            return data || []
        }
        
        this.cache.set(`columns:${this.payload.token}`, info.columns);
        return info.data || [];
    }


}

class Member extends Base {
    constructor(...args) {
        super(...args);
    }

    
    async metrics({ tool }) {
        let url = `account.json?act=send-metrics`;

        let data = new FormData();

        data.append('tool', tool);
        
        let response = await this.api.post(url, data, {
            headers: {
                'x-token': this.payload.token,
                ...data.getHeaders()
            }
        });

        console.log('Member.metrics');

        return response.data;
    }

    async tableProfiles({ filters, map_columns = true } = {}) {
        let url = `account.json?act=get-table-profiles`;
    
        let response = await this.api.get(url, {
            headers: {
                'x-token': this.payload.token
            }
        });
        let { active, profiles } = response.data.content;

        let columns = this.cache.get(`columns:${this.payload.token}`);
        
        if(!columns) {
            await (new Analytics({ req: this.req, res: this.res })).get({ filters, map_columns });
            columns = this.cache.get(`columns:${this.payload.token}`);
        }

        columns = columns.reduce((memo, column) => {
            let key = column.title.replace(/\./g, '');

            memo[key] = column;

            return memo;
        }, {})

        return { columns, active, profiles };
    }

    async optionPlan({ tool_id }) {
        let data = await this.api.get(`account.json?act=available-option-plans&tool_id=${tool_id}`, {
            headers: {
                'x-token': this.payload.token
            }
        });

        return data.data.content.plans;
    }
  
    async saveKit(kit) {
        const formData = new FormData();
        
        formData.append('filter', JSON.stringify(kit));
        
        let data = await this.api.post(`account.json?act=save-user-filters`, formData, {
        headers: {
            'x-token': this.payload.token,
            ...formData.getHeaders()
        }
        });
        
        return data.data.content;
    }
  
    async deleteKit({ id }) {
        let response = await this.api.get(`account.json?act=delete-user-filters&filter_id=${id}`, {
          headers: {
              'x-token': this.payload.token
          }
        });
        
        console.log(response);
        
        return response.data.content;
    }
    
    async updateKit({ id, filters }) {
        const formData = new FormData();
        
        formData.append('filter_id', parseInt(id));
        formData.append('filter_data', JSON.stringify(filters));
        
        let data = await this.api.post(`account.json?act=update-user-filters`, formData, {
            headers: Object.assign({ 'x-token': this.payload.token }, formData.getHeaders())
        });
        
        return data.data.content[0];
    }
    
    async activateKit({ id }) {
        let data = await this.api.get(`account.json?act=activate-user-filters&filter_id=${id}`, {
            headers: { 'x-token': this.payload.token }
        });
        
        return data.data.content;
    }
    
    async kits() {
        let data = await this.api.get(`account.json?act=get-user-filters`, {
            headers: { 'x-token': this.payload.token }
        });
        
        return data.data.content;
    }

    async get() {
        let info = this.cache.get(`member.get:${this.payload.token}`);

        if(!info) {
            info = await Promise.all([
                this.api.get('account.json?act=get-account-info', {
                    headers: {
                        'x-token': this.payload.token
                    }
                }),
                this.api.get('account.json?act=available-tariffs', {
                    headers: {
                        'x-token': this.payload.token
                    }
                }),
                this.api.get('account.json?act=user-tools', {
                    headers: {
                        'x-token': this.payload.token
                    }
                }),
            ]);
            
            let response = info.map(response => response.data.content);
            let err = info.some(response => response.data.status === 'error');

            let [user, tariffs, tools] = response;

            if(err) {
                this.cache.reset();
                this.res.clearCookie('token');

                throw new Error(user);
            }

            this.cache.set(`member.get:${this.payload.token}`, { user, tariffs, tools });

            return { user, tariffs, tools };
        }

        return info;
    }

    $error(params) {
        let err = new Error('fuck');
        
        err.code = 400;

        throw err;

        return params;
    }

    $echo(params) {
        let err = new Error('fuck');
        
        err.code = 400;

        throw err;

        return params;
    }

    $name() {
        return 'name';
    }

    $age(params) {
        console.log('age:', params);
        return error;
    }

    $formData(params) {
        console.log(params);

        const path = require('path');

        for(let key in params.files) {
            let file = params.files[key];
            
            let saveTo = path.join(process.cwd(), 'uploads');
            this.fs.ensureDirSync(saveTo);
            saveTo = path.join(saveTo, file.filename);

            file.stream.pipe(this.fs.createWriteStream(saveTo));
        }
        
    }

    async _avatar(params, { res }) {
        console.log(params);

        const path = require('path');
        let default_ava = path.join(process.cwd(), 'uploads', 'default', 'ava.png');
        let ava = path.join(process.cwd(), 'uploads', 'ava.jpg');

        !this.fs.pathExistsSync(ava) && (ava = default_ava);

        //res.locals.sendAsFile = this.fs.pathExistsSync(ava);
        
        return {
            $sendAsFile: this.fs.pathExistsSync(ava),
            file: ava
        };
    }
}

module.exports = { Member, Analytics };
