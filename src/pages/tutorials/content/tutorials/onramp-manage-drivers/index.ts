import { defineTutorial } from '@/content/schema';
import coverEn from './cover-en.jpg';
import coverRu from './cover-ru.jpg';
import step1 from './step-1.jpg';
import step2 from './step-2.jpg';
import step3 from './step-3.jpg';
import step4 from './step-4.jpg';
import step5 from './step-5.jpg';
import step6 from './step-6.jpg';
import step7 from './step-7.jpg';
import step8 from './step-8.jpg';
import step9 from './step-9.jpg';
import step9b from './step-9b.jpg';
import step10 from './step-10.jpg';
import step11 from './step-11.jpg';
import step12 from './step-12.jpg';
import step13 from './step-13.jpg';
import step14 from './step-14.jpg';
import step15 from './step-15.jpg';
import step16 from './step-16.jpg';

export default defineTutorial({
  category: 'onramp',
  order: 20,
  title: {
    ru: 'Как управлять профилем для водителей?',
    en: 'How to manage drivers?',
  },
  description: {
    ru: 'Добавьте водителя, а потом при необходимости измените его данные, сбросьте пароль или деактивируйте его',
    en: 'Add a driver, then change their details, reset their password or deactivate them when needed',
  },
  cover: { ru: coverRu, en: coverEn },
  body: [
    {
      type: 'text',
      text: {
        ru: 'Всё, что связано с водителями, делается на странице «Manage Drivers». Сначала добавьте водителя, а затем при необходимости меняйте его данные, сбрасывайте пароль или деактивируйте его.',
        en: 'Everything about drivers happens on the Manage Drivers page. First add a driver, then change their details, reset their password or deactivate them when needed.',
      },
    },
    {
      type: 'steps',
      title: { ru: 'Добавление водителя', en: 'Add a driver' },
      description: {
        ru: 'Добавьте каждого водителя в аккаунт, чтобы он мог входить в приложение ONRAMP и пользоваться топливной картой.',
        en: 'Add each driver to your account so they can log in to the ONRAMP app and use the fuel card.',
      },
      items: [
        {
          title: { ru: 'Откройте раздел «Manage Drivers»', en: 'Open Manage Drivers' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В меню слева нажмите **«Manage Drivers»**. На этой странице собраны все водители вашего аккаунта — и активные, и деактивированные. Здесь можно добавлять новых водителей, менять их данные, сбрасывать пароли и деактивировать тех, кто у вас больше не работает.',
                en: 'In the menu on the left, click **“Manage Drivers”**. This page lists all the drivers on your account, both active and deactivated. From here you can add new drivers, edit their details, reset their passwords and deactivate drivers who no longer work for you.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'По умолчанию список открывается с фильтром «Status: Active». Уберите его, чтобы увидеть и деактивированных водителей.',
                en: 'By default the list opens with the “Status: Active” filter. Remove it to see your deactivated drivers as well.',
              },
            },
            { type: 'image', src: step1 },
          ],
        },
        {
          title: { ru: 'Откройте форму «Add Driver»', en: 'Open the Add Driver form' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Чтобы добавить водителя, нажмите кнопку **«Add Driver»** в правом верхнем углу. Откроется форма **«Add Driver»**. В следующих шагах мы заполним её поле за полем.',
                en: 'To add a driver, click the **“Add Driver”** button in the top right corner. The **“Add Driver”** form opens. The next steps go through it field by field.',
              },
            },
            { type: 'image', src: step2 },
          ],
        },
        {
          title: { ru: 'Введите External ID', en: 'Enter the External ID' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Driver External ID»** введите собственный ID этого водителя. Он отображается в ваших отчётах, а если в **«Settings»** включён запрос Driver ID, он также служит ID водителя.',
                en: 'In **“Driver External ID”**, enter your own ID for this driver. It appears in your reports, and it also serves as the driver’s ID if the Driver ID prompt is turned on in **“Settings”**.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Рекомендуем использовать последние 5 цифр номера водительского удостоверения. Так вы никогда не перепутаете двух водителей с одинаковыми именем и фамилией.',
                en: 'We recommend using the last 5 digits of the driver’s license number. That way, two drivers with the same first and last name are never mixed up.',
              },
            },
            { type: 'image', src: step3 },
          ],
        },
        {
          title: { ru: 'Введите имя', en: 'Enter the name' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Введите имя и фамилию водителя в поля **«First Name»** и **«Last Name»**.',
                en: 'Enter the driver’s **“First Name”** and **“Last Name”**.',
              },
            },
            { type: 'image', src: step4 },
          ],
        },
        {
          title: { ru: 'Введите номер телефона', en: 'Enter the phone number' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Phone Number»** введите номер мобильного телефона водителя. Его последние 4 цифры понадобятся для пароля в шаге 7.',
                en: 'In **“Phone Number”**, enter the driver’s mobile number. You will need its last 4 digits for the password in Step 7.',
              },
            },
            { type: 'image', src: step5 },
          ],
        },
        {
          title: { ru: 'Введите email', en: 'Enter the email' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Email»** введите личный email водителя. На него придёт приветственное письмо с данными для входа.\n\nЕсли email не принимается и появляется ошибка, значит, этот адрес уже зарегистрирован на платформе ONRAMP — обычно предыдущей компанией водителя. Попросите водителя связаться с этой компанией, чтобы там деактивировали его аккаунт. После деактивации вы сможете добавить водителя с этим email.',
                en: 'In **“Email”**, enter the driver’s own email address. This is where the driver receives the welcome email with their login details.\n\nIf the email is not accepted and you see an error, this address is already registered on the ONRAMP platform, usually by the driver’s previous company. Ask the driver to contact that company and have them deactivate the driver’s account. Once it is deactivated, you can add the driver with this email.',
              },
            },
            { type: 'image', src: step6 },
          ],
        },
        {
          title: { ru: 'Задайте временный пароль', en: 'Set a temporary password' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В поле **«Password»** введите временный пароль. Подойдёт любой, но, пожалуйста, используйте **последние 4 цифры номера телефона водителя**.\n\nВ приветственном письме водителю сообщается, что его временный пароль — последние 4 цифры его номера телефона. Если вы зададите другой пароль, водитель введёт эти 4 цифры и не сможет войти.',
                en: 'In **“Password”**, enter a temporary password. Any password will work here, but please use the **last 4 digits of the driver’s phone number**.\n\nThe welcome email tells the driver that their temporary password is the last 4 digits of their phone number. If you set a different password, the driver will try those 4 digits and won’t be able to log in.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Пример: номер телефона — (916) 916-9169, значит, временный пароль — 9169.',
                en: 'Example: the phone number is (916) 916-9169, so the temporary password is 9169.',
              },
            },
            { type: 'image', src: step7 },
          ],
        },
        {
          title: {
            ru: 'Выберите тип и дату начала работы',
            en: 'Choose the type and start date',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Выберите **«Driver Type»** из списка, затем укажите **«Start Date»** — день, когда водитель начинает у вас работать. Дату можно ввести вручную или выбрать в календаре.',
                en: 'Select the **“Driver Type”** from the list, then enter the **“Start Date”**, the day the driver starts working with you. You can type the date or pick it from the calendar.',
              },
            },
            { type: 'image', src: step8 },
          ],
        },
        {
          title: { ru: 'Отправьте форму', en: 'Submit the form' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Проверьте данные и нажмите **«Submit»**.',
                en: 'Check the details and click **“Submit”**.',
              },
            },
            { type: 'image', src: step9 },
            {
              type: 'text',
              text: {
                ru: 'Новый водитель появится в списке со статусом **«Active»**.',
                en: 'The new driver now appears in the list with the status **“Active”**.',
              },
            },
            { type: 'image', src: step9b },
          ],
        },
      ],
    },
    {
      type: 'steps',
      title: { ru: 'Управление водителем', en: 'Manage a driver' },
      description: {
        ru: 'После добавления водителя можно изменить его данные, решить, видит ли он ваши скидки на топливо, сбросить пароль или деактивировать его. Всё это делается на странице водителя.',
        en: 'After a driver is added, you can change their details, choose whether they see your fuel discounts, reset their password or deactivate them. All of this is done on the driver’s page.',
      },
      items: [
        {
          title: { ru: 'Откройте страницу водителя', en: 'Open the driver’s page' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Откройте **«Manage Drivers»** и найдите водителя. Нажмите на **значок карандаша** в конце его строки — откроется страница водителя.',
                en: 'Go to **“Manage Drivers”** and find the driver. Click the **pencil icon** at the end of their row to open the driver’s page.',
              },
            },
            { type: 'image', src: step10 },
          ],
        },
        {
          title: { ru: 'Начните редактирование', en: 'Start editing' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'На странице водителя показаны его данные и лимиты на топливо. Чтобы изменить данные, нажмите **«Edit Driver»** вверху.',
                en: 'The driver’s page shows their details and fuel limits. To change the details, click **“Edit Driver”** at the top.',
              },
            },
            { type: 'image', src: step11 },
          ],
        },
        {
          title: { ru: 'Измените данные и сохраните', en: 'Change the details and save' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Теперь поля можно редактировать. Вы можете изменить **имя**, **фамилию**, **email**, **номер телефона** и **External ID** водителя. Когда закончите, нажмите **«Save»**.',
                en: 'The fields can now be edited. You can change the driver’s **first name**, **last name**, **email**, **phone number** and **External ID**. When you are done, click **“Save”**.',
              },
            },
            { type: 'image', src: step12 },
          ],
        },
        {
          title: {
            ru: 'Решите, видит ли водитель ваши скидки',
            en: 'Choose if the driver sees your discounts',
          },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'В той же форме настройка **«Show discounts»** определяет, видит ли водитель ваши цены на топливо со скидкой. По умолчанию их видят все водители:',
                en: 'In the same form, **“Show discounts”** controls whether the driver sees your discounted fuel prices. By default, every driver sees them:',
              },
            },
            {
              type: 'bullets',
              items: [
                {
                  ru: '**«Default (company setting)»**: водитель видит цены со скидкой. Эта настройка стоит у каждого нового водителя.',
                  en: '**Default (company setting)**: the driver sees discounted prices. This is the setting every new driver starts with.',
                },
                {
                  ru: '**«Yes»**: водитель видит цены со скидкой.',
                  en: '**Yes**: the driver sees discounted prices.',
                },
                {
                  ru: '**«No»**: скидки скрыты. Водитель видит только розничные цены — в чеках и на колонке.',
                  en: '**No**: discounts are hidden. The driver sees retail prices only, on receipts and at the pump.',
                },
              ],
            },
            {
              type: 'text',
              text: {
                ru: 'Чтобы скрыть ваши скидки от этого водителя, выберите **«No»** и нажмите **«Save»**.',
                en: 'To hide your discounts from this driver, choose **“No”** and click **“Save”**.',
              },
            },
            { type: 'image', src: step13 },
          ],
        },
        {
          title: { ru: 'Найдите кнопки внизу страницы', en: 'Find the buttons at the bottom' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Кнопки **«Reset Password»** и **«Deactivate Driver»** находятся внизу страницы водителя, под **«LIMITS»**. Прокрутите страницу вниз, чтобы их найти.',
                en: '**“Reset Password”** and **“Deactivate Driver”** are at the bottom of the driver’s page, below **“LIMITS”**. Scroll down to find them.',
              },
            },
            { type: 'image', src: step14 },
          ],
        },
        {
          title: { ru: 'Сбросьте пароль', en: 'Reset the password' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Чтобы сбросить пароль водителя, нажмите **«Reset Password»**. Введите новый пароль в поле **«New Password»**, затем ещё раз в **«Confirm New Password»**. Требования к паролю:',
                en: 'To reset the driver’s password, click **“Reset Password”**. Enter the new password in **“New Password”** and again in **“Confirm New Password”**. The password needs:',
              },
            },
            {
              type: 'checklist',
              items: [
                { ru: 'Не менее 8 символов', en: 'At least 8 characters' },
                {
                  ru: 'Только буквы и цифры, без символов',
                  en: 'Letters and numbers only, no symbols',
                },
                { ru: 'Хотя бы 1 заглавная буква', en: 'At least 1 capital letter' },
              ],
            },
            {
              type: 'text',
              text: {
                ru: 'Затем нажмите **«Save»** и сообщите водителю новый пароль.',
                en: 'Then click **“Save”** and give the driver their new password.',
              },
            },
            { type: 'image', src: step15 },
          ],
        },
        {
          title: { ru: 'Деактивируйте водителя', en: 'Deactivate the driver' },
          blocks: [
            {
              type: 'text',
              text: {
                ru: 'Чтобы деактивировать водителя, нажмите **«Deactivate Driver»**, затем **«Confirm»** в открывшемся окне. Водитель больше не сможет пользоваться своим аккаунтом ONRAMP.',
                en: 'To deactivate the driver, click **“Deactivate Driver”**, then click **“Confirm”** in the window that opens. The driver can no longer use their ONRAMP account.',
              },
            },
            {
              type: 'callout',
              variant: 'tip',
              text: {
                ru: 'Деактивируйте водителей сразу, как только они уходят из вашей компании. Так их email освобождается, и следующая компания сможет их добавить.',
                en: 'Deactivate drivers as soon as they leave your company. This frees up their email, so their next company can add them.',
              },
            },
            { type: 'image', src: step16 },
          ],
        },
      ],
    },
  ],
});
