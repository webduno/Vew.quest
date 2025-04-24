
interface LandingUsernameInputProps {
  typedUsername: string;
  setTypedUsername: (value: string) => void;
  handleStart: () => void;
}

export function LandingUsernameInput({ typedUsername, setTypedUsername, handleStart }: LandingUsernameInputProps) {
  return (
    <div>
      <input 
        type="text" 
        className='bord-r-10 tx-altfont-2 py-2 mb-2 px-3 tx-center'
        placeholder='Enter your name'
        style={{
          border: "1px solid #E5E5E5",
        }}
        value={typedUsername}
        onChange={(e) => { setTypedUsername(e.target.value) }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleStart();
          }
        }}
      />
    </div>
  );
} 