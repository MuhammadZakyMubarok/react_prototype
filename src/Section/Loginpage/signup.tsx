import './sign.css'

function Signup(){
    return(
        <main className="page">
            <section className="auth">
            <div className="auth__media" aria-label="Illustration">
                <img src="welcome.png" alt="illustration" />
            </div>

            <div className="auth__content">
                <div className="form">
                <h1 className="form__title">Create Account</h1>

                <div className="form__social">
                    <button className="social-btn" type="button">
                    <span className="social-btn__icon google" aria-hidden="true">G</span>
                    <span>Sign up with Google</span>
                    </button>

                    <button className="social-btn" type="button">
                    <span className="social-btn__icon facebook" aria-hidden="true">f</span>
                    <span>Sign up with Facebook</span>
                    </button>
                </div>

                <div className="form__divider">
                    <span className="form__divider-line"></span>
                    <span className="form__divider-text">Or signing using your email</span>
                </div>

                <form className="form__fields" action="#" method="post">

                    <label className="field">
                    <span className="field__label">Name</span>
                    <input className="field__input" type="text" name="name" placeholder="" />
                    </label>

                    <label className="field">
                    <span className="field__label">Email</span>
                    <input className="field__input" type="text" name="contact" placeholder="" />
                    </label>

                    <label className="field">
                    <span className="field__label">Password</span>
                    <input className="field__input" type="password" name="password" placeholder="" />
                    </label>

                    <label className="check">
                    <input className="check__box" type="checkbox" name="terms" />
                    <span className="check__text">
                        I agree to <a href="#" className="link">terms</a> and <a href="#" className="link">Privacy Policy</a>
                    </span>
                    </label>

                    <button className="primary-btn" type="submit">Sign up</button>

                    <p className="form__foot">
                    Already seem an access? <a href="#signin" className="link">Sign in</a>
                    </p>
                </form>
                </div>
            </div>
            </section>
        </main>
    )
}
export default Signup