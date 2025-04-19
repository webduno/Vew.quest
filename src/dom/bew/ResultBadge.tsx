'use client';

export const ResultBadge = ({
  sentObject, target, results, label, keyName
}: {
  sentObject: any;
  target: any;
  results: any;
  label: string;
  keyName: string;
}) => {
  return (
    <div className="flex-col bord-r-15 "
      style={{
        padding: "3px",
        // background: "#FFC801",
        background: "#afafaf",
      }}
    >
      <div className="flex-col flex-1 tx-start tx-white py-1 px-3">
        <div>{label}: {sentObject?.[keyName]}</div>
      </div>
      <div className="tx-white flex-col py-2 bg-white w-100 bord-r-15 flex-row gap-2"
        style={{
          // color: "#F1CE0D"
          color: "#4b4b4b"
        }}
      >
        <div>Target: {target.values[keyName]}</div>
        <div>{Number(results[keyName]).toFixed(3)}%</div>
      </div>
    </div>
  );
};
