// Code for stripe implementation https://stripe.com/docs/stripe-js/v2

Stripe.setPublishableKey('pk_test_Cl8Aspr1PomfVXrWl3eT2RrQ');

const $form = $('#checkout-form');

$form.submit(function(event) {
  $('#checkout-error').addClass('d-none');
  $form.find('button').prop('disabled', true);
  Stripe.card.createToken({
    name: $('#card-holder').val(),
    number: $('#card-number').val(),
    cvc: $('#card-cvc').val(),
    exp_month: $('#card-expiry-month').val(),
    exp_year: $('#card-expiry-year').val()
  }, stripeResponseHandler);
  return false;
});

function stripeResponseHandler(status, response) {
  if (response.error) { // Problem!

    // Show the errors
    $('#checkout-error').text(response.error.message);
    $('#checkout-error').removeClass('d-none');
    $form.find('button').prop('disabled', false); // Re-enable submission

  }
  else { // Token was created!

    // Get the token ID:
    var token = response.id;

    // Insert the token into the form so it gets submitted to the server:
    $form.append($('<input type="hidden" name="stripeToken" />').val(token));

    // Submit the form:
    $form.get(0).submit();

  }
}
