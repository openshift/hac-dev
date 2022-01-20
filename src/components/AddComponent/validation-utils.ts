import { string, object } from 'yup';

export const gitUrlRegex =
  /^((((ssh|git|https?:?):\/\/:?)(([^\s@]+@|[^@]:?)[-\w.]+(:\d\d+:?)?(\/[-\w.~/?[\]!$&'()*+,;=:@%]*:?)?:?))|([^\s@]+@[-\w.]+:[-\w.~/?[\]!$&'()*+,;=:@%]*?:?))$/;

export const validationSchema = object({
  source: string()
    .max(2000, 'Please enter a URL that is less than 2000 characters.')
    .matches(gitUrlRegex, 'Invalid Source URL')
    .required('Required'),
  git: object({
    reference: string(),
    contextDir: string(),
  }),
});
