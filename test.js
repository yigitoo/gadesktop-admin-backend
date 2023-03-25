class UnitTest {
    constructor()
    {
        const t_make_login = this.make_login();
        const t_get_comp = this.get_comp();
        const t_get_case = this.get_case();

        this.assert([
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
        ])
    }
    assert(...tests)
    {
        for(const test of tests)
        {
            if(test.isPassed)
                console.log(`Test passed for ${test.name} ✅`)
            else
                console.log(`Test durmak at ${test.name} ❌!`)
        }
    }
    async make_login()
    {
        const data = await fetch('https://gadesktop-admin-backend.vercel.app/login', {
            method:"POST",
            body: JSON.stringify({
                email: "rawns0909@gmail.com",
                secretKey: SECRET_KEY
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
        const data = await fetch('https://gadesktop-admin-backend.vercel.app/', {
            method:"POST",
            body: JSON.stringify({
                email: "rawns0909@gmail.com",
                secretKey: SECRET_KEY
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


make_req()