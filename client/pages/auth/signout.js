import { useEffect } from 'react'
import useRequest from '../../hooks/use-request'
import Router  from 'next/router'

export default () => {
    const { doRequest } = useRequest({
        url: '/api/users/signout',
        method: 'post',
        body: {},
        OnSuccess: () => Router.push("/")
    })

    useEffect(() => {
        doRequest()
    }, []);
    return <h2>Pls wait </h2>
}