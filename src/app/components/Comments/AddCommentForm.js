import React, { useState } from 'react';
import styled from '@emotion/styled';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import EntryCommentDataService from '../../../services/entryComment.service';
import ButtonLoading from '../ButtonLoading';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

const AddCommentForm = ({
  entryId,
  parentCommentId,
  commentsReloading,
  handleCancelClick,
}) => {
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
      nick_name: data.entryCommentNick,
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

  return (
    <AddCommentWrapper>
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
        <TextField
          id='entry-comment-nick'
          label='Nick'
          fullWidth
          rows={4}
          error={errors.entryCommentNick ? true : false}
          helperText={
            errors.entryCommentNick && errors.entryCommentNick.message
          }
          variant='outlined'
          {...register('entryCommentNick', {
            required: 'To pole jest wymagane',
            minLength: {
              value: 3,
              message: 'Nick powinien mieć minimum 2 znaki',
            },
            maxLength: {
              value: 30,
              message: 'Nick moze zawierać maksymalnie 30 znaków',
            },
          })}
        />
        <AddCommentActions>
          <ButtonWrapper>
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
          </ButtonWrapper>
        </AddCommentActions>
      </form>
    </AddCommentWrapper>
  );
};

const AddCommentWrapper = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
`;

const AddCommentActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 10px;
  margin-bottom: 5px;
  padding: 0 15px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  button {
    margin: 0;
  }

  > button {
    margin-left: 10px;
  }
`;

export default AddCommentForm;
