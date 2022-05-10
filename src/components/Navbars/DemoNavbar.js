
import React from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Container,
  Button,
} from "reactstrap";
import { setUserSetting, getUserSetting } from '../../views/services/users';
import { all_betting } from '../../views/services/betting';
import { routes } from "routes.js";
import { NavLink } from "react-router-dom";
import { getChipsById } from "../../views/services/users";
import { i18n } from "../i18n/hindi";
import "bootstrap/dist/css/bootstrap.css";
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      color: "transparent",
      exposure: 0,
      chips: 0,
      language: localStorage.getItem('language')
    };
    this.toggle = this.toggle.bind(this);
    this.sidebarToggle = React.createRef();
  }
  toggle() {
    if (this.state.isOpen) {
      this.setState({
        color: "transparent",
      });
    } else {
      this.setState({
        color: "dark",
      });
    }
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  getUserSetting = async () => {
    let userSetting = await getUserSetting({ user_id: localStorage.getItem("userId") }).then(function (response, error) {
      localStorage.setItem("language", response.data.data.language);
    }).catch((error) => {
      return error;
    });
  }

  getBrand() {
    let brandName = "MATKA 777";
    routes.map((prop, key) => {
      if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
        brandName = prop.name;
      }
      return null;
    });
    return brandName;
  }
  openSidebar() {
    document.documentElement.classList.toggle("nav-open");
    this.sidebarToggle.current.classList.toggle("toggled");
  }
  // function that adds color dark/transparent to the navbar on resize (this is for the collapse)
  updateColor() {
    if (window.innerWidth < 993 && this.state.isOpen) {
      this.setState({
        color: "dark",
      });
    } else {
      this.setState({
        color: "transparent",
      });
    }
  }
  getBetHistory = async () => {
    var pagerule = {
      search: '',
      from: '',
      to: '',
      limit: 100000,
      offset: 1,
      id: localStorage.getItem("userId"),
    };
    var BetHistory = await all_betting({ slug: "LIVE" }, pagerule);
    var total = 0;
    BetHistory.data.data.map(bet => {
      total = Number(bet.bet_amount) + Number(total);
      return true;
    });
    this.setState({
      exposure: total
    });
  }


  getChipsById = async () => {
    // var body = localStorage.getItem('userId');
    var response = await getChipsById({ id: localStorage.getItem("userId") });
    this.setState({ chips: response.data.data[0].chips });
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateColor.bind(this));
    this.getBetHistory();
    this.getChipsById();
    this.getChipsById();
    setInterval(() => {
      this.getChipsById();
    }, 20000);
    this.getUserSetting();
  }

  setLanguage = async (e) => {
    const data = {
      language: e.target.value,
      user_id: localStorage.getItem("userId")
    };
    let userSetting = await setUserSetting(data).then((response, error) => {
      console.log(response);
      this.getUserSetting();
        if(e.target.value === "eng"){
        window.alert("(Plase refrash the page) Language Setting Change Successfully!");
        } else if (e.target.value === "hin") {
          window.alert("(कृपया पेज को रीफ़्रेश करें) भाषा सेटिंग सफलतापूर्वक बदली गई!");
        }
    }).catch((error) => {
      return error;
    });
  }
  componentDidUpdate(e) {
    // console.log("componentDidUpdate: ",this.state.hindi)
    if (
      window.innerWidth < 993 &&
      e.history.location.pathname !== e.location.pathname &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      this.sidebarToggle.current.classList.toggle("toggled");
      //   this.sidebarToggle.current.y.toggle("toggled");
    }
  }
  logout() {
    var role = localStorage.getItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("supermasterId");
    localStorage.removeItem("adminId");
    localStorage.removeItem("is_blocked");
    localStorage.clear();
    if (role !== 'user') {
      window.location.replace('/admin');
    } else {
      window.location.replace('/');
    }

  }
  // languageChange = (e) => {
  // this.lang = {hindi: e.target.checked}
  // }
  render() {
    return (

      <Navbar color="dark" expand="lg" className="fixed-top navbar-absolute">
        <Container fluid>
          <div className="navbar-wrapper">
            <div className="navbar-toggle">
              <button
                type="button"
                ref={this.sidebarToggle}
                className="navbar-toggler"
                onClick={() => this.openSidebar()}
              >
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </button>
            </div>
            <NavbarBrand href="/">{this.getBrand()}</NavbarBrand>
          </div>
          <NavbarToggler onClick={this.toggle}>
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
          </NavbarToggler>
          <div class="custom-control custom-switch">
            {/* {console.log("hindi: ",this.state.hindi)} */}
            {localStorage.getItem('role') === "user" ?
                  <>
                    <select className="lang-select" onChange={this.setLanguage}>
                      <option>Language</option>
                      <option value="hin">हिन्दी</option>
                      <option value="eng">English</option>
                    </select>
                  </>
               : null}
          </div>
          <Collapse
            isOpen={this.state.isOpen}
            navbar
            className="justify-content-end"
          >
            {localStorage.getItem('role') === "user" ?
              <p className="border p-2">{this.state.language === "hin" ? i18n.DEMONAVBAR.EXPOSURE.hindi : i18n.DEMONAVBAR.EXPOSURE.english} : {this.state.exposure} </p>
              : <p className="border p-2">{i18n.DEMONAVBAR.EXPOSURE.english} : {this.state.exposure} </p>}
            {localStorage.getItem('role') === "user" ?
              <p className="border p-2 mx-2">{this.state.language === "hin" ? i18n.DEMONAVBAR.BALANCE.hindi : i18n.DEMONAVBAR.BALANCE.english} : {this.state.chips} </p>
              : null}
            {localStorage.getItem("is_blocked") === "true" &&
              <NavLink className="btn theme-btn" to="#" color="danger">{this.state.language === "hin" ? i18n.DEMONAVBAR.YOU_ARE_BLOCKED.hindi : i18n.DEMONAVBAR.YOU_ARE_BLOCKED.english}</NavLink>
            }
            {/* {console.log("lang: ",this.state.language === "hin")} */}
            {localStorage.getItem('role') === "user" ? <NavLink to="/dashboard/change-password" className="px-3 text-light">{this.state.language === "hin" ? i18n.DEMONAVBAR.CHANGE_PASSWORD.hindi : i18n.DEMONAVBAR.CHANGE_PASSWORD.english} </NavLink>
              : <NavLink to="/dashboard/change-password" className="px-3 text-light">{i18n.DEMONAVBAR.CHANGE_PASSWORD.english} </NavLink>}
            <Button onClick={this.logout}><i className="nc-icon nc-button-power" /></Button>
          </Collapse>
        </Container>
      </Navbar>

    );
  }
}

export default Header;
