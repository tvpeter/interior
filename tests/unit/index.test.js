const Index = require('../../src/views/index');

describe("Page to contain title and header", ()=>{

    it('should display page title', ()=> {
       // const title = header.getElementsByTagName("title")[0].innerHTML;
        const title = new Index().render();
        
        expect(title.html()).toContain('FMG Furniture | Homepage');
    });
    
});