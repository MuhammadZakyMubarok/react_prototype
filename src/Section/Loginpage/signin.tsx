import './sign.css'

function Signin(){
    return(
        <main className="page">
        <section className="auth">
        <div className="auth__media" aria-label="Illustration">
            <img src="images/astro.jpg" alt="Astronaut illustration" />
        </div>

        <div className="auth__content">
            <div className="form">
            <h1 className="form__title">Sign In</h1>

            <p className="form__subtitle">
                Welcome back! Please enter your details.
            </p>

            <form className="form__fields" action="#" method="post">
                <label className="field">
                <span className="field__label">Email</span>
                <input className="field__input" type="email" name="email" required />
                </label>

                <label className="field">
                <span className="field__label">Password</span>
                <input className="field__input" type="password" name="password" required />
                </label>

                <div className="login-row">
                <label className="check login-row__left">
                    <input className="check__box" type="checkbox" name="remember" />
                    <span className="check__text">Remember me</span>
                </label>

                <a className="link login-row__right" href="#">Forgot password?</a>
                </div>

                <button className="primary-btn" type="submit">Sign in</button>

                <p className="form__foot">
                Don't have an account? <a href="#" className="link">Sign up</a>
                </p>
            </form>
            </div>
        </div>
        </section>
    </main>
    )
}
export default Signin