import * as Yup from 'yup';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    date: Yup.date().required(),
    provider_id: Yup.number().required(),
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
