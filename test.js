import 'dotenv/config'
class UnitTest {
    constructor()
    {
        this.SECRET_KEY = process.env.SECRET_KEY;

        const [t_make_login, t_get_comp, t_get_case] = this.run_tests(this.make_login, this.get_comp, this.get_case);
                
        const is_all_test_passed = this.assert([
            {
                name: "Make_Login",
                isPassed: t_make_login
            },
            {
                name: "Get_Complaint",
                isPassed: t_get_comp
            },
            {
                name: "Get_Complaint_Case",
                isPassed: t_get_case
            }
        ]) ? "All test are passed!" : "All test are NOT passed!"
    }
    async run_tests(...funtion_list)
    {
        const check_list = [];
        let temp;
        for(const _function of function_list){
            temp = await _function();
            check_list.push(temp);
        }
        return check_list;
    }
    assert(...tests)
    {
        for(const test of tests)
        {
            if(test.isPassed)
                console.log(`Test passed for ${test.name} ✅`)
            else
                console.log(`Test halt at ${test.name} ❌!`)
        }
        return true;
    }
    async make_login()
    {
        const data = await fetch('https://gadesktop-admin-backend.vercel.app/login', {
            method:"POST",
            body: JSON.stringify({
                email: "rawns0909@gmail.com",
                secretKey: this.SECRET_KEY
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const response = await data.json();
        
        console.log(response)
        return true
    }
    async get_comp()
    {
        const data = await fetch('https://gadesktop-admin-backend.vercel.app/complaints', {
            method:"POST",
            body: JSON.stringify({
                email: "rawns0909@gmail.com",
                secretKey: this.SECRET_KEY
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const response = await data.json();
        
        console.log(response)
        return true
    }
    async get_case()
    {
        const data = await fetch('https://gadesktop-admin-backend.vercel.app/complaint_case', {
            method:"POST",
            body: JSON.stringify({
                comp_id: "7b29bd67-482e-4127-b6f9-a907cdf2caea"
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const response = await data.json();
        
        console.log(response)
        return true
    }
}

const unittest = new UnitTest();