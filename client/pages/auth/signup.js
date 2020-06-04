import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router'
import { TextField, Typography, Paper } from '@material-ui/core'

export default () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [cPassword, setCpassword] = useState('')
    const { doRequest, errors } = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: { email, password },
        onSuccess: () => Router.push('/')
    })

    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(email, password)
        doRequest()
    }

    const textStyle = { minWidth: '35%',marginTop:'15px'}
    return (
        <div>
           
            <form onSubmit={onSubmit} style={{display:'flex',flexDirection:'column',alignItems:'center',minWidth:'35%'}}>
                <TextField
                    style={textStyle}
                    variant='filled'
                    placeholder="sholmes@221b.st"
                    label="Email Address"
                    value={email}
                    onChange={e => setEmail(e.target.value)} />
              
                <TextField  
                    style={textStyle}
                    variant='filled'
                    placeholder="********"
                    label="Password"
                    value={password}
                    type='password'
                    
                    onChange={e => setPassword(e.target.value)} />
              
                <TextField
                    style={textStyle}
                    variant='filled'
                    placeholder="********"
                    label="Confirm Password"
                    value={cPassword}
                    type='password'
                    onChange={e => setCpassword(e.target.value)} />
                <button className="btn btn-light" style={textStyle} >Sign up</button>
                {errors}
            </form>
        </div>
    )

}