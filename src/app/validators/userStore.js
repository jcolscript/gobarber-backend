import * as Yup from 'yup';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string()
      .email()
      .required(),
    cellphone: Yup.string()
      .required()
      .matches(
        /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:(([2-9])\d{3})?(\d{4}))(?:|[0-9])$/
      ),
    password: Yup.string()
      .required()
      .min(6),
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
