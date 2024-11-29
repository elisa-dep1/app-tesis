import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import styles from '../styles/styleGame.module.css';

export default function InitForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  // Maneja el envío del formulario
  const onSubmit = (data) => {
    console.log("Formulario enviado:", data);
    // Navega a la siguiente vista solo si el formulario es válido
    router.push("/home");
  };

  return (
    <div className="contentInitForm">
      <h2>Ingresar</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Campo de correo */}
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Correo</label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Ingresar correo"
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                message: "Correo no válido",
              },
            })}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>

        {/* Campo de contraseña */}
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Contraseña</label>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            id="exampleInputPassword1"
            placeholder="Ingresar contraseña"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
            })}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password.message}</div>
          )}
        </div>
        <button type="submit" className={styles.completeButton} style={{height: '40px', padding: ' 5px 10px'}}>Entrar</button>
      </form>
      <button onClick={() => router.push('/registerForm')} className={styles.completeButton} style={{height: '40px', padding: ' 5px 10px'}}>Registrarme</button>
    </div>
  );
}
