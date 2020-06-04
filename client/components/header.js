import Link from 'next/link'
const Header = ({ currentUser }) => {

    const headerLinks = [
        !currentUser && { label: "Login", url: "/auth/signin" },
        !currentUser && { label: "Register", url: "/auth/signup" },
        currentUser && { label: "Create Tickets", url: "/tickets/new" },
        currentUser && { label: "My Orders", url: "/orders" },
        currentUser && { label: "Signout", url: "/auth/signout" }
    ].filter(linkConfig => linkConfig)
        .map(({ label, url }) => {
            return (<li key={url} className="nav-item">
                <Link href={url}>
                    <a className="nav-link" style={{ color: "#fff" }}>{label}</a>
                </Link>
            </li>)
        })

    return (
        <nav className="navbar navbar-dark" style={{ backgroundColor: "#272f3d", margin: 0, padding: 0, height:'60px' }}>
            <Link href="/">
                <a className="navbar-brand" style={{ marginLeft: '5%' }}>
                    <img src="/images/jtlogo.svg" alt="logo" width="100px" height="35px" />
                </a>
            </Link>
            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">
                    {headerLinks}
                </ul>
            </div>
        </nav>)
}
export default Header