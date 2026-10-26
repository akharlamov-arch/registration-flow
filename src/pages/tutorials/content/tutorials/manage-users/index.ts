import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.png';
import coverRu from './cover-ru.png';
import edit1 from './edit-1.png';
import edit2 from './edit-2.png';
import edit3 from './edit-3.png';
import edit4 from './edit-4.png';
import edit5 from './edit-5.png';
import step1 from './step-1.jpg';
import step2 from './step-2.png';
import step2Note from './step-2-note.png';
import step3 from './step-3.png';
import step4 from './step-4.png';
import step5 from './step-5.png';
import step6 from './step-6.png';

export default defineTutorial({
  category: 'pumpprice',
  order: 5,
  title: {
    ru: 'Как создать или изменить юзера/драйвера в приложении PumpPrice?',
    en: 'How to create or edit user/driver in PumpPrice app?',
  },
  description: {
    ru: 'Следуйте этой простой инструкции, для добавления или изменения данных юзеров/драйверов для ваших топливных карт.',
    en: 'Follow this simple guide to add or edit user/driver data for your fuel cards.',
  },
  cover: {
    ru: coverRu,
    en: coverEn,
  },
  readTime: 5,
  body: [
    {
      type: 'steps',
      items: [
        {
          title: {
            ru: 'Войдите в систему',
            en: 'Log in to the system',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Войдите в систему на портале **PumpPrice** по ссылке: [pumpprice.co](https://www.pumpprice.co/users/sign_in) и введите свой логин и пароль, которые были высланы вам на email при регистрации профиля',
                en: 'Log in to the **PumpPrice** Portal at: [pumpprice.co](https://www.pumpprice.co/users/sign_in) and enter your login and password that were sent to your email when your profile was registered',
              },
            },
            {
              type: 'image',
              src: step1,
            },
            {
              type: 'callout',
              variant: 'hint',
              text: {
                ru: 'Письмо с логином и паролем было выслано вам с адреса **support@pumpprice.co**',
                en: 'The email with your login and password was sent from **support@pumpprice.co**',
              },
            },
          ],
        },
        {
          title: {
            ru: 'Откройте настройки',
            en: 'Open settings',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'На главной странице "Dashboard" вашего аккаунта выберите пункт "Settings".',
                en: 'On your account Dashboard page, select "Settings".',
              },
            },
            {
              type: 'image',
              src: step2,
            },
            {
              type: 'callout',
              variant: 'hint',
              text: {
                ru: 'В появившемся окне вы также можете заполнить данные вашей компании',
                en: 'In the window that appears, you can also fill in your company details',
              },
            },
            {
              type: 'image',
              src: step2Note,
            },
          ],
        },
        {
          title: {
            ru: 'Перейдите в раздел Users',
            en: 'Go to the Users section',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Для перехода к разделу юзеры, нажмите соответствующую кнопку "Users"',
                en: 'To go to the users section, click the "Users" button',
              },
            },
            {
              type: 'image',
              src: step3,
            },
          ],
        },
        {
          title: {
            ru: 'Добавьте нового пользователя',
            en: 'Add new user',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Вы увидите список уже существующих юзеров. Для добавления нового пользователя, нажмите кнопку "Add User"',
                en: 'You will see a list of existing users. To add a new user, click the "Add User" button',
              },
            },
            {
              type: 'image',
              src: step4,
            },
          ],
        },
        {
          title: {
            ru: 'Заполните данные пользователя',
            en: 'Fill in user details',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В появившемся окне заполните данные пользователя: **Email, Пароль, Имя, Фамилия**. Важно правильно выбрать тип аккаунта (Сотрудник или Владелец/Оператор) и установить права использования (права администратора или владелец карты).',
                en: 'In the window that appears, fill in the user details: **Email, Password, First Name, Last Name**. It is important to correctly select the account type (Employee or Owner/Operator) and set usage rights (administrator rights or card holder).',
              },
            },
            {
              type: 'image',
              src: step5,
            },
            {
              type: 'callout',
              variant: 'hint',
              text: {
                ru: 'Если вы предоставляете пользователю права администратора "Fleet Administrator", то созданный пользователь сможет создавать/управлять юзерами, менять настройки, и управлять картами (если данный функционал предоставлен провайдером)',
                en: 'If you grant "Fleet Administrator" rights to a user, the created user will be able to create/manage users, change settings, and manage cards (if this functionality is provided by the provider)',
              },
            },
          ],
        },
        {
          title: {
            ru: 'Сохраните пользователя',
            en: 'Save user',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'После введения всех данных нажмите кнопку "Save User". После этого пользователю автоматически придет письмо на указанный электронный адрес с инструкциями как зайти в приложение PumpPrice.',
                en: 'After entering all the data, click the "Save User" button. After this, the user will automatically receive an email at the specified address with instructions on how to log in to the PumpPrice app.',
              },
            },
            {
              type: 'image',
              src: step6,
            },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      text: {
        ru: 'Вам также будет доступна возможность в любой момент редактировать пользователей, устанавливать разные роли и другое (Данный функционал доступен только для аккаунта с правами администратора - "Fleet Administrator").',
        en: 'You will also be able to edit users at any time, set different roles, and more (This functionality is only available for accounts with administrator rights - "Fleet Administrator").',
      },
    },
    {
      type: 'steps',
      variant: 'secondary',
      title: {
        ru: 'Редактирование пользователей',
        en: 'Editing users',
      },
      items: [
        {
          title: {
            ru: 'Редактирование пользователя',
            en: 'Editing a user',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Для того, чтобы редактировать юзера перейдите в раздел "Users" и нажмите на иконку "карандаш", напротив пользователя, которому необходимо внести изменения.',
                en: 'To edit a user, go to the "Users" section and click the "pencil" icon next to the user you need to modify.',
              },
            },
            {
              type: 'image',
              src: edit1,
            },
          ],
        },
        {
          title: {
            ru: 'Изменение информации',
            en: 'Changing information',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В появившемся окне вы можете изменить необходимую информацию, после чего нажать на кнопку "Save User"',
                en: 'In the window that appears, you can change the necessary information, then click the "Save User" button',
              },
            },
            {
              type: 'image',
              src: edit2,
            },
          ],
        },
        {
          title: {
            ru: 'Установка роли',
            en: 'Setting role',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В разделе "Roles" вы можете установить новую роль для пользователя',
                en: 'In the "Roles" section, you can set a new role for the user',
              },
            },
            {
              type: 'image',
              src: edit3,
            },
          ],
        },
        {
          title: {
            ru: 'Изменение пароля',
            en: 'Changing password',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В разделе "Set password" вы можете установить новый пароль для пользователя (новый пароль отправится на email данного юзера)',
                en: 'In the "Set password" section, you can set a new password for the user (the new password will be sent to this user\'s email)',
              },
            },
            {
              type: 'image',
              src: edit4,
            },
          ],
        },
        {
          title: {
            ru: 'Дополнительные действия',
            en: 'Additional actions',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В разделе "Action" вы можете:\n• сгенерировать автоматический случайный новый пароль, который будет отправлен на email пользователя\n• отправить пользователю ссылку с инструкцией как войти в программу\n• деактивировать пользователя',
                en: 'In the "Action" section you can:\n• generate an automatic random new password that will be sent to the user\'s email\n• send the user a link with instructions on how to log into the program\n• deactivate the user',
              },
            },
            {
              type: 'image',
              src: edit5,
            },
          ],
        },
      ],
    },
    {
      type: 'callout',
      variant: 'conclusion',
      text: {
        ru: 'Готово! Вы успешно создали/изменили юзеров-драйверов в вашем аккаунте PumpPrice.',
        en: 'Done! You have successfully created/edited user-drivers in your PumpPrice account.',
      },
    },
  ],
});
