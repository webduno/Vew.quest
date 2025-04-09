"use client"

export default function AboutPage() {
  return <div>
    <ConfigPage />
  </div>;
} 

export const ConfigPage = () => {
  return <div className="w-100 flex-col">
    <i className="tx-white tx-altfont-5 tx-xl mt-8">Config</i>
    <div>
      <div>
        <button className="tx-red tx-center opaci-chov--50 bord-r-5 border-red mt-100" onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}>Reset User Data <br /> and Settings</button>
      </div>
    </div>
  </div>;
}


