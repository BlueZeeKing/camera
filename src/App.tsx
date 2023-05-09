import { useEffect, useState } from "react";

export default function App() {
  const [options, setOptions] = useState<[string, string][] | undefined>();
  const [deviceId, setDeviceId] = useState<string | undefined>();

  const setStream = async () => {
    if (deviceId == undefined) {
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: deviceId,
      },
    });

    (document.querySelector("#video") as HTMLVideoElement).srcObject = stream;
  };

  useEffect(() => {
    async () => {
      await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      const options = await navigator.mediaDevices.enumerateDevices();

      setOptions(
        options
          .filter((item) => item.kind == "videoinput")
          .map((item) => [item.deviceId, item.label])
      );
    };
  }, []);

  useEffect(() => {
    setStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((options) => {
      setOptions(
        options
          .filter((item) => item.kind == "videoinput")
          .map((item) => [item.deviceId, item.label])
      );
    });
  }, []);

  return (
    <>
      <video id="video" autoPlay className="h-screen object-cover w-screen" />
      {options != undefined ? (
        <select
          onChange={(e) => setDeviceId(e.target.value)}
          value={deviceId}
          className={`fixed bottom-0 left-0 m-2 ${
            deviceId == undefined ? "opacity-100" : "opacity-0"
          } hover:opacity-100 transition-opacity duration-150 border-zinc-200 hover:border-zinc-300 outline-none border-2 rounded p-3 px-5`}
        >
          {deviceId == undefined ? (
            <option value={undefined} key="Other">
              Choose ID
            </option>
          ) : (
            ""
          )}
          {options.map(([id, name]) => (
            <option value={id} key={id}>
              {name}
            </option>
          ))}
        </select>
      ) : (
        ""
      )}
    </>
  );
}
