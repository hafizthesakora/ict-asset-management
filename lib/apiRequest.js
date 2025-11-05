import toast from 'react-hot-toast';

export async function makePostRequest(
  setLoading,
  url,
  data,
  resourceName,
  reset,
  redirect
) {
  try {
    setLoading(true);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      console.log(response);
      setLoading(false);
      toast.success(`New ${resourceName} created successfully`);
      reset();
      // Call redirect if provided
      if (redirect && typeof redirect === 'function') {
        redirect();
      }
    } else {
      setLoading(false);
      if (response.status === 409) {
        toast.error('The giving warehouse stock is not enough');
      } else {
        toast.error('Something went wrong, Try again');
      }
    }
  } catch (error) {
    console.log(error);
    setLoading(false);
    toast.error('Failed to create ');
  }
}

export async function makePutRequest(
  setLoading,
  url,
  data,
  resourceName,
  redirect,
  reset
) {
  try {
    setLoading(true);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      console.log(response);
      setLoading(false);
      toast.success(`${resourceName} Updated successfully`);
      redirect();
    } else {
      setLoading(false);
      toast.error('Something went wrong, Try again');
    }
  } catch (error) {
    console.log(error);
    setLoading(false);
    toast.error('Failed to update');
  }
}
