import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router'
import { TextField } from '@material-ui/core'

export default () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { doRequest, errors } = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: { email, password },
        onSuccess: () => Router.push('/')
    })

    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(email, password)
        doRequest()
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-md">
                    <h1>Log in</h1>
                    <form onSubmit={onSubmit}>
                        <div >
                            <TextField variant="outlined"
                                label="Email address"
                                size="small"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)} />
                        </div>
                        <br />
                        <div >
                            <TextField variant="outlined"
                                label="Enter Password"
                                size="small"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)} />
                        </div>
                    
                        <div style={{color:"#8e44ad",fontSize:"13px",marginTop:"5px",padding:"0px"}}>
                            Forgot your password ?
                        </div>
                        <br/>
                        <button className="btn btn-outline-primary">Sign in</button>
                        {errors}
                    </form>
                </div>
                <div className="col-md">
                    <img src="/images/login.svg" />
                </div>
            </div>
        </div>
    )

}