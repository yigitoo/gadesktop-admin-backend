async function make_req()
{
    const data = await fetch('https://gadesktop-admin-backend.vercel.app/login', {
        method:"POST",
        body: JSON.stringify({
            email: "rawns0909@gmail.com",
            secretKey: "templekiller"
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })

    console.log(data)
}

make_req()