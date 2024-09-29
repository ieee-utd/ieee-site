import "./notification.css";

function Notification() {
  function Spawn(type: string, text: string) {
    //Spawn a different type of notification
    //Create
    //Swoop down for 3 seconds
    //Swoop back up
    //Delete
  }

  const types = (
    <>
      <div className="alert fade alert-simple alert-success">
        <strong className="font__weight-semibold">◝(⁰▿⁰)◜ Well done!</strong>‎
        You successfully read this important. You successfully read this
        important. You successfully read this important.
      </div>
      <div
        className="alert fade alert-simple alert-info"
        role="alert"
        data-brk-library="component__alert"
      >
        <strong className="font__weight-semibold">(人´∀`) Heads up!</strong>‎
        This alert needs your attention, but it's not super important.
      </div>
      <div
        className="alert fade alert-simple alert-warning"
        role="alert"
        data-brk-library="component__alert"
      >
        <strong className="font__weight-semibold">ᕕ(°□°)ᕗ Warning!</strong>‎
        Better check yourself, you're not looking too good.
      </div>
      <div
        className="alert fade alert-simple alert-danger"
        role="alert"
        data-brk-library="component__alert"
      >
        <strong className="font__weight-semibold">(ง •̀_•́)ง Oh snap!</strong>‎
        Change a few things up and try submitting again.
      </div>
      <div
        className="alert fade alert-simple alert-primary"
        role="alert"
        data-brk-library="component__alert"
      >
        <strong className="font__weight-semibold">ദ്ദി(ᵔᗜᵔ) Well done!</strong>{" "}
        ‎ You successfully read this important.
      </div>
    </>
  );

  return <></>;
}

export default Notification;
