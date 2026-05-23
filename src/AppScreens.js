//vai controlar qual ecra esta visivel e tambem renderiza a barra de navegação no topo
import { useState } from "react";
import { useUser, UserButton } from "@clerk/clerk-react";
import HomeScreen from "./screens/HomeScreen";
import LibraryScreen from "./screens/LibraryScreen";


export const colors= {
    bg: "#4a5e38",
    bgdark:"#3a4d2a",
    bgCard:"#3f5230",
    accent:"#2e3d1f",
    text:"#fff",
    textMuted: "#c8d8b0",
    tabActive: "#fff",
    tabInactive:"#8aab6a",
    border: "#5a7040",
};

function AppScreens () {
    //vai ter a tab ativa
    const [tab,setTab]= useState("home");
    const {user} = useUser();
    return (
        <div style= {{
            width:"100%",
            height:"100%",
            display:"flex",
            flexDirection:"column",
            background: colors.bg,
            fontFamily: "'Georgia', serif",
            overflow: "hidden",
        }}>

            {/*é o header */}
            <header style={{
                background: colors.bgDark,
                padding: "10px 12px 0 12px",
                flexShrink: 0,
            }}>
                {/* logo e o avatar*/}
                <div style ={{
                    display:"flex",
                    justifyContent: "space-between",
                    alignItems:"center",
                    marginBottom:"8px",
                }}>
                    <div style={{ fontSize:"18px", color: colors.text }}>
                        Generative<span style= {{ fontWeight:"900"}}>Jazz</span>
                    </div>
                    {/* botao do perfil*/}
                    <UserButton afterSignOuturl="/"/>
                </div>

                {/*tabs de navegação*/}
                <nav style = {{ display: "flex", gap:"4px"}}>
                    {[
                        {id: "home", label:"Inicio"},
                        {id:"library", label:"Biblioteca"},
                    ].map(({id,label }) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            style= {{
                                flex: 1,
                                padding:"7px 4px",
                                background:"none",
                                border:"none",
                                borderBottom: tab === id
                                    ? `2px solid ${colors.tabActive}`
                                    : "2px solid transparent",
                                color: tab == id ? colors.tabActive : colors.tabInactive,
                                fontWeight : tab == id ? "bold" : "normal",
                                fontSize: "13px",
                                cursor: "pointer",
                                fontFamily: "'Georgia',serif",
                                transition: "all 0.2s",
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </nav>
            </header>

            {/* conteudo*/}
            <main style = {{ flex: 1, overflow: "auto", overflowX:"hidden"}}>
                {tab === "home" && <HomeScreen />}
                {tab === "library" && <LibraryScreen />}
            </main>

        </div>
    );
}

export default AppScreens