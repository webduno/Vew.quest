import Link from "next/link";



export const BewLogo = () => {
    return (
      <Link href="/" prefetch={false} 
      className="nodeco tx-lg -blur tx-shadow-5 tx-white tx-center w-100 tx-altfont-5 flex-row px-2 py-4
      opaci-chov--50 z-100 pos-rel
      "
      style={{
  
      }}
      tabIndex={-1}
      >
        <div>WEB</div>
        <div className='tx-altfont-1 '>|</div>
        <div style={{ transform: "scaleX(-1)" }}>WEB</div>
      </Link>
    );
  }