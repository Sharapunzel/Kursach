import {observer} from "mobx-react-lite";
import "./Header.css";
import {useContext} from "react";
import {Context} from "../../app/components/RootProviderContainer/RootProviderContainer";
import {Breadcrumb, Button, Dropdown, MenuProps, Space} from "antd";
import {
    CheckOutlined, CloseOutlined,
    DownOutlined,
    HomeOutlined,
    LoginOutlined, LogoutOutlined,
    SettingOutlined,
    UserOutlined
} from "@ant-design/icons";
import {SPARoutes} from "../../app/routes/spa/SPARoutes";

function Header(){

    const {store} = useContext(Context);

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'My Account',
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: 'Name',
            extra: `${store.user !== null ? store.user.given_name : "Name"}`,
        },
        {
            key: '3',
            label: 'Surname',
            extra: `${store.user !== null ? store.user.family_name : "Surname"}`,
        },
        {
            key: '4',
            label: 'Nickname',
            extra: `${store.user !== null ? store.user.preferred_username : "Nickname"}`,
        },
        {
            key: '5',
            label: 'Email',
            extra: <>
                {store.user !== null ?
                    <>
                        <span style={{marginRight: 3}}>{store.user.email}</span>
                        {store.user.email_verified ? <CheckOutlined/> : <CloseOutlined/>}
                    </> :
                    <span>Email</span>
                }
            </>,
        },
        {
            type: 'divider',
        },
        {
            key: '6',
            label: 'Log out',
            extra: <>
                <Button onClick={()=>store.logout()} icon={<LogoutOutlined/>}/>
            </>,
        },
    ];

    return(
        <header className={"header_container"}>
            <div>
                <div className="header_menu">
                    {store.isAuth ?
                        <Breadcrumb
                            items={[
                                {
                                    href: SPARoutes.Private.HOME,
                                    title: <>
                                        <HomeOutlined/>
                                        <span>Home Page</span>
                                    </>
                                },
                                {
                                    href: SPARoutes.Private.API_PAGE,
                                    title: (
                                        <>
                                            <span>API Page</span>
                                        </>
                                    ),
                                },
                                {
                                    href: SPARoutes.Private.API_WS_PAGE,
                                    title: (
                                        <>
                                            <span>API Web Sockets Page</span>
                                        </>
                                    ),
                                }
                            ]}
                        />
                        : <Breadcrumb
                            items={[
                                {
                                    href: SPARoutes.Common.LOGIN,
                                    title: <>
                                        <LoginOutlined />
                                        <span>Log In</span>
                                    </>
                                }
                            ]}
                        />
                    }
                </div>
                {store.isAuth && <div className="header_userinfo">
                    <Dropdown menu={{ items }} trigger={['click']}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                User Info
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </div>}
            </div>
        </header>
    )

}
export default observer(Header);