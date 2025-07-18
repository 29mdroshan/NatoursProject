class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // Build the query string
        //1A) Filtering
        const queryObj =  {...this.queryString}
        const excludedFields = ['page','sort', 'limit', 'fields']
        excludedFields.forEach(i => delete queryObj[i]);

        // 1B) Advance Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr))
        return this;
    }

    sort() {
        
        if(this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
         } else {
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }

    fields() {
        
        if(this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)
         } 
         return this;
    }

    pagination() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 10
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
    
        return this;
    }
}

module.exports = APIFeatures