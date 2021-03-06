import axios from "axios";
import BackIcon from "../../../svgs/icons/Back";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "../../../hooks/UserContext";
export default function AvailableCars({ listCar, data }) {
  const router = useRouter();
  const [logged, setlogged] = useState(null);
  const { getUser } = useUser();
  const removeRent = async () => {
    await axios
      .delete(`https://desolate-sea-14156.herokuapp.com/rent/${data._id}`)
      .then(() => router.back());
  };
  const close = () => {
    setlogged(null);
  };

  const onSubmit = async (idCar, price, imageCar) => {
    await getUser(async (user) => {
      if (user) {
        await axios
          .put(`https://desolate-sea-14156.herokuapp.com/rent/${data._id}`, {
            idCar,
            idUser: user._id,
            price,
            imageCar,
            user_name: user.name,
          })
          .then(() => router.push(`/rent/${data._id}`));
      } else {
        router.replace("/login");
      }
    });
  };

  return (
    <>
      <header onClick={(e) => removeRent(e)}>
        <BackIcon />
        <p>Cancelar</p>
      </header>

      <div className="grid">
        <h3>{`Autos disponibles para ser recogidos en ${
          data.location
        } el dia ${new Date(data.pickUp).getUTCDate()} a las ${
          data.pickHour
        }:00 `}</h3>
        <main>
          {listCar.map((car) => (
            <section key={car._id}>
              <div>
                <img src={car.imageUrl} alt="" />
              </div>
              <div className="info">
                <h4>{`${car.brand} ${car.model}`}</h4>
              </div>

              <div className="btn">
                <p>Precio : {car.price_per_day * data.days}</p>
                <button
                  onClick={() =>
                    onSubmit(
                      car._id,
                      car.price_per_day * data.days,
                      car.imageUrl
                    )
                  }
                >
                  <p>Seleccionar</p>
                </button>
              </div>
            </section>
          ))}
        </main>
      </div>
      <style jsx>
        {`
          header {
            display: flex;
            align-items: center;
          }
          main {
            width: 100vw;
            display: flex;
            flex-direction: column;
            align-content: center;
            align-items: center;
            height: 100vh;
            overflow-y: scroll;
            border-radius: 5px;
          }

          h3 {
            text-align: center;
            margin-top: 0;
          }
          .btn {
            text-align: center;
          }

          section {
            margin: 10px 20px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 1);
            border: 1px solid #eee;
            display: flex;
            width: 95%;
            flex-direction: column;
            align-items: center;
            align-content: center;
            justify-content: space-between;
          }
          button {
            box-shadow: 0px 0px 5px rgba(0, 0, 0, 1);
            background-color: #000;
            color: #fff;
            border: none;
            margin: 5px 6px;
            padding: 15px 30px;
            transition: all ease-in 0.6s;
          }
          button:hover {
            background-color: #0009;
          }

          img {
            max-width: 270px;
          }
          .grid {
            display: grid;
            place-content: center;
          }
          p {
            margin: 0;
          }
          @media only screen and (min-width: 800px) {
            section {
              flex-direction: row;
            }
            header {
              position: absolute;
            }
          }
        `}
      </style>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const { id } = ctx.query;
  var data;
  var listCar = [];
  await axios
    .get(`https://desolate-sea-14156.herokuapp.com/rent/${id}`)
    .then(async (res) => {
      if (res.data) {
        data = res.data;
        const { pickUp, dropOff } = res.data;

        await axios
          .post(
            `https://desolate-sea-14156.herokuapp.com/rent/searchAvailable`,
            { pickUp, dropOff }
          )
          .then((response) => {
            listCar = response.data;
          });
      }
    });

  return {
    props: {
      listCar,
      data,
    },
  };
};
