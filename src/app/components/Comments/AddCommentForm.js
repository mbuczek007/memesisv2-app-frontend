import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import EntryCommentDataService from '../../../services/entryComment.service';
import ButtonLoading from '../shared/ButtonLoading';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const AddCommentForm = ({
  entryId,
  parentCommentId,
  commentsReloading,
  handleCancelClick,
}) => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    mode: 'onChange',
  });

  const onSubmit = (data) => {
    setIsLoading(true);

    EntryCommentDataService.createComment({
      comment: data.entryComment,
      entry_id: entryId,
      parent_comment_id: parentCommentId,
      user_id: user.id,
    })
      .then((response) => {
        setIsLoading(false);
        reset();
        enqueueSnackbar(response.data.message, {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
        commentsReloading(response.data.newCommentId);
      })
      .catch((e) => {
        setIsLoading(false);
        enqueueSnackbar(e.response.data.message, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      });
  };

  if (!isLoggedIn) {
    return <p>Zaloguj się aby dodawać komentarze.</p>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          id='entry-comment'
          label='Dodaj komentarz'
          multiline
          fullWidth
          rows={4}
          error={errors.entryComment ? true : false}
          helperText={errors.entryComment && errors.entryComment.message}
          variant='outlined'
          {...register('entryComment', {
            required: 'To pole jest wymagane',
            minLength: {
              value: 3,
              message: 'Komentarz powinien mieć minimum 2 znaki',
            },
            maxLength: {
              value: 6000,
              message: 'Komentarz moze zawierać maksymalnie 6000 znaków',
            },
          })}
        />
        <div>
          <div>
            <ButtonLoading
              ctaText='Wyślij'
              loading={isLoading}
              isDisabled={false}
            />
            {parentCommentId !== null && (
              <Button disabled={isLoading} onClick={handleCancelClick}>
                Anuluj
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCommentForm;
