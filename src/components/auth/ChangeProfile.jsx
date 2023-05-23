import { Button, Row, Col, Label, Input, FormGroup, Form } from "reactstrap";

export function ChangeProfile(
  handleSubmit,
  setNama,
  load,
  userName,
  userEmail
) {
  return (
    <>
      <div clasName="mt-2">
        <h2>Edit Profil Saya</h2>
        <hr />
        <Form className="form" onSubmit={handleSubmit}>
          <Row>
            <Col lg="5" sm="10">
              <FormGroup>
                <Label>Nama</Label>
                <Input
                  defaultValue={userName}
                  placeholder="Nama"
                  type="text"
                  onInput={(e) => setNama(e.target.value)}
                ></Input>
              </FormGroup>
            </Col>
            <Col lg="5" sm="10">
              <FormGroup>
                <Label>Email</Label>
                <Input
                  disabled
                  defaultValue={userEmail}
                  placeholder="Email"
                  type="email"
                ></Input>
              </FormGroup>
            </Col>
          </Row>

          <div>
            {load === true ? (
              <div className="text-right">
                <lord-icon trigger="loop" src="/loader.json"></lord-icon>
              </div>
            ) : (
              <div className="text-right">
                <Button className="btn-round" color="info" size="md">
                  Submit
                </Button>
              </div>
            )}
          </div>
        </Form>
      </div>
    </>
  );
}
