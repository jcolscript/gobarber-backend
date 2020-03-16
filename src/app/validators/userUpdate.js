import * as Yup from 'yup';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email(),
    cellphone: Yup.string().matches(
      /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:(([2-9])\d{3})?(\d{4}))(?:|[0-9])$/
    ),
    oldPassword: Yup.string().min(6),
    password: Yup.string()
      .min(6)
      .when('oldPassword', (oldPassword, fild) =>
        oldPassword ? fild.required() : fild
      ),
    confirmPassword: Yup.string().when('password', (password, fild) =>
      password ? fild.required().oneOf([Yup.ref('password')]) : fild
    ),
  });

  schema
    .validate(req.body, { abortEarly: false })
    .then(() => next())
    .catch(errors => {
      const schemaErrors = errors.inner.map(err => {
        return { field: err.path, message: err.message };
      });

      return res.status(400).json({
        message: 'some fields are not valid',
        fields: schemaErrors,
      });
    });
};
