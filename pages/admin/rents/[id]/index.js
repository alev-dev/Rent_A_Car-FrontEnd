import axios from "axios";
import "react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useRouter } from "next/router";

export default function Details({ rent, car, user }) {
  const router = useRouter();

  const sendEmailConfirm = async () => {
    await axios
      .post("https://desolate-sea-14156.herokuapp.com/sendMail/confirm", {
        car,
        email: user.email,
        asunto: "Confirmar Renta",
        rent,
      })
      .then((res) => router.replace("/rent/emailSend"));
  };

  return (
    <>
      <NotificationContainer />
      <div className="full">
        <header>
          <h3>Detalles de la renta</h3>
        </header>
        <main>
          <div className="image">
            <img src={car.imageUrl} alt="" />
          </div>

          <section>
            <div className="col">
              <h3>{`Precio por dia : ${car.price_per_day} $`}</h3>
              <h3>{`Precio total : ${rent.price} $`}</h3>
              <h3>{`Días de reserva : ${rent.days} `}</h3>
            </div>
            <div className="col">
              <h3>{`Lugar de recogida : ${rent.location}`}</h3>
              <h3>{`Fecha de recogida : ${new Date(rent.pickUp).getUTCDate()}/${
                new Date(rent.pickUp).getMonth() + 1
              }/${new Date(rent.pickUp).getFullYear()}`}</h3>
              <h3>{`Fecha de entrega : ${new Date(rent.dropOff).getUTCDate()}/${
                new Date(rent.dropOff).getMonth() + 1
              }/${new Date(rent.dropOff).getFullYear()}`}</h3>
              <h3>{`Hora de recogida : ${
                rent.pickHour < 12
                  ? `${rent.pickHour} AM`
                  : `${rent.pickHour} PM`
              }`}</h3>
              <h3>{`Hora de Entrega : ${
                rent.dropHour < 12
                  ? `${rent.dropHour} AM`
                  : `${rent.dropHour} PM`
              }`}</h3>
            </div>
            <div className="col flex1">
              <h3>{`Nombre del Usuario : ${user.name}`}</h3>
              <h3>{`Correo del usuario : ${user.email}`}</h3>
              <h3>{`País del usuario : ${user.country}`}</h3>
              <h3>{`Dirección : ${user.address}`}</h3>
              <h3>{`Teléfono : ${user.phone}`}</h3>
            </div>

            <h3 className="red">
              {rent.cancelated
                ? "La renta fue cancelada por el usuario"
                : !rent.active &&
                  "Renta inactiva porque El usuario eliminó la cuenta "}
            </h3>
          </section>
        </main>
      </div>

      <style jsx>{`
        .full {
          width: 100vw;
          height: 100vh;
        }
        .red {
          color: red;
        }
        h3,
        h4 {
          margin: 4px 5px;
        }
        header {
          display: grid;
          place-content: center;
          place-items: center;
          background-color: #000;
          color: #fff;
        }
        main {
          margin: 4px 4px;
          border: 3px solid #eee;
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 1);
        }
        h2 {
          margin: 0;
        }
        button {
          position: fixed;
          bottom: 20px;
          color: #fff;
          right: 20px;
          padding: 30px 30px;
          border-radius: 999px;
          background-color: #000;
          border: 0;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 1);
        }
        section {
          display: flex;
          align-content: center;
          align-items: center;
          flex-wrap: wrap;
          flex: 1;
          background-color: #eee;
        }
        .image {
          display: flex;
          align-items: center;
          align-content: center;
          justify-content: center;
          width: 100%;
        }
        img {
          width: 100%;
        }

        .col {
          display: grid;
          place-items: center;
          place-content: center;
          min-width: 300px;
          text-align: center;
          flex: 1;
        }
        @media only screen and (min-width: 940px) {
          .image {
            min-width: 300px;
          }
          img {
            width: 40%;
          }
        }
      `}</style>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const { id } = ctx.query;

  var rent = null;
  var car = null;
  var user = null;
  await axios
    .get(`https://desolate-sea-14156.herokuapp.com/rent/${id}`)
    .then(async (res) => {
      rent = res.data;
      await axios
        .get(`https://desolate-sea-14156.herokuapp.com/user/${res.data.idUser}`)
        .then(async (resUser) => {
          user = resUser.data;
          await axios
            .get(`https://desolate-sea-14156.herokuapp.com/car/${rent.idCar}`)
            .then((response) => {
              car = response.data;
            });
        });
    });
  return {
    props: {
      rent,
      car,
      user,
    },
  };
};
