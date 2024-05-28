import * as React from "react";

interface EmailTemplateProps {
  name: string;
  otp: string;
  email: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  otp,
  email,
}) => (
  <div
    style={{
      borderCollapse: "collapse",
      borderSpacing: 0,
      margin: 0,
      padding: 0,
      width: "100%",
      height: "100%",
      lineHeight: "100%",
      backgroundColor: "#f0f0f0",
      color: "#000000",
    }}
  >
    <div className="adM"></div>
    <table
      width="100%"
      align="center"
      border={0}
      cellPadding={0}
      cellSpacing={0}
      style={{
        borderCollapse: "collapse",
        borderSpacing: 0,
        margin: 0,
        padding: 0,
        width: "100%",
      }}
    >
      <tbody>
        <tr>
          <td
            align="center"
            valign="top"
            style={{
              borderCollapse: "collapse",
              borderSpacing: 0,
              margin: 0,
              padding: 0,
            }}
          >
            <table
              border={0}
              cellPadding={0}
              cellSpacing={0}
              align="center"
              width={560}
              style={{
                borderCollapse: "collapse",
                borderSpacing: 0,
                padding: 0,
                width: "inherit",
                maxWidth: 560,
              }}
            >
              <tbody>
                <tr>
                  <td
                    align="center"
                    valign="top"
                    style={{
                      borderCollapse: "collapse",
                      borderSpacing: 0,
                      margin: 0,
                      padding: 0,
                      paddingLeft: "6.25%",
                      paddingRight: "6.25%",
                      width: "87.5%",
                      paddingTop: 10,
                      paddingBottom: 20,
                    }}
                  >
                    <a
                      style={{ textDecoration: "none" }}
                      href="https://www.mergerware.com/"
                      target="_blank"
                      data-saferedirecturl="https://www.google.com/url?q=https://www.mergerware.com/&source=gmail&ust=1706858048802000&usg=AOvVaw1lCuYt5sV7_fPi_OxPpmhq"
                    >
                      <img
                        src="https://ci3.googleusercontent.com/meips/ADKq_Na0W57pT8Bn9PAyZxxkSuDnOg2kTSXUAMQJazDdGHc00SpvBSUT9oA0BgFVYsryl0uthgtCpI1nb6gh9B4PykGn2Zz46kCqk2a2p_oGbvtuPr1by2HXhH07yLWIyYdVOVBShDQYM6Z2aJ83ZaiMIImpiv3XvQ=s0-d-e1-ft#https://66.media.tumblr.com/484b916a1ebcdefa8500463c3393507d/tumblr_q8k9sgUYDF1yfw2qfo1_400.png"
                        alt="MergerWare-Logo"
                        title="MergerWare-Logo"
                        style={{
                          color: "#000000",
                          width: "16rem",
                          fontSize: 10,
                          margin: 0,
                          padding: 0,
                          outline: "none",
                          textDecoration: "none",
                          border: "none",
                          display: "block",
                        }}
                        className="CToWUd"
                        data-bit="iit"
                      />
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              border={0}
              cellPadding={0}
              cellSpacing={0}
              align="center"
              bgcolor="#FFFFFF"
              width={560}
              style={{
                borderCollapse: "collapse",
                borderSpacing: 0,
                padding: 0,
                width: "inherit",
                maxWidth: 560,
              }}
            >
              <tbody>
                <tr>
                  <td
                    align="center"
                    valign="top"
                    style={{
                      borderCollapse: "collapse",
                      borderSpacing: 0,
                      margin: 0,
                      padding: 0,
                      paddingLeft: "2rem",
                      paddingRight: "6.25%",
                      width: "87.5%",
                      lineHeight: "150%",
                      paddingTop: 15,
                      color: "#000000",
                      fontFamily: "roboto",
                    }}
                  >
                    {" "}
                    <h1
                      style={{
                        fontWeight: "normal",
                        textAlign: "left",
                        marginTop: 25,
                        color: "black",
                        fontSize: 15,
                      }}
                    >
                      Dear {name},
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td
                    align="center"
                    valign="top"
                    style={{
                      borderCollapse: "collapse",
                      borderSpacing: 0,
                      margin: 0,
                      padding: 0,
                      paddingBottom: 0,
                      paddingLeft: "6.25%",
                      paddingRight: "6.25%",
                      width: "87.5%",
                      fontSize: 18,
                      fontWeight: 300,
                      lineHeight: "150%",
                      paddingTop: 0,
                      color: "#000000",
                      fontFamily: "roboto",
                    }}
                  />
                </tr>
                <tr>
                  <td width="100%">
                    <table
                      align="center"
                      width={570}
                      cellPadding={0}
                      cellSpacing={0}
                    >
                      <tbody>
                        <tr>
                          <td>
                            <div
                              style={{
                                fontSize: 15,
                                margin: "2rem",
                                lineHeight: "160%",
                                marginTop: 0,
                                marginBottom: 0,
                              }}
                            >
                              <p>
                                To get started using Mergerware, please use the
                                OTP below for validation:
                              </p>
                              <p
                                className="m_-308112401276940979otp-message"
                                style={{
                                  width: "50%",
                                  padding: 20,
                                  backgroundColor: "#eceff1",
                                  borderRadius: 4,
                                }}
                              >
                                Your OTP :<strong>{otp}</strong>
                              </p>
                              <p>
                                For your reference, your email is
                                <strong>
                                  <a href={`mailto:${email}`} target="_blank">
                                    {email}
                                  </a>
                                </strong>{" "}
                                for logging to the platform
                              </p>
                              <strong>
                                This is an auto-generated mail. Please do not
                                reply
                              </strong>
                            </div>
                            <p
                              style={{
                                textAlign: "left",
                                fontSize: 15,
                                padding: 10,
                                margin: "1.5rem",
                                lineHeight: "160%",
                                marginTop: 0,
                              }}
                            >
                              Regards
                              <br />
                              MergerWare Team
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr style={{ marginTop: 0 }}>
                  <td
                    align="left"
                    valign="top"
                    style={{
                      borderCollapse: "collapse",
                      borderSpacing: 0,
                      margin: 0,
                      padding: 0,
                      paddingLeft: "1.25%",
                      paddingRight: "1.25%",
                      width: "87.5%",
                      paddingTop: 0,
                    }}
                  >
                    <hr style={{ margin: 0, padding: 0, color: "#E0E0E0" }} />
                  </td>
                </tr>
                <tr>
                  <td
                    align="center"
                    valign="top"
                    style={{
                      borderCollapse: "collapse",
                      borderSpacing: 0,
                      margin: 0,
                      padding: 0,
                      paddingLeft: "6.25%",
                      paddingRight: "6.25%",
                      width: "87.5%",
                      fontSize: 10,
                      fontWeight: 400,
                      lineHeight: "160%",
                      paddingTop: 20,
                      paddingBottom: 25,
                      color: "#000000",
                      fontFamily: "roboto",
                    }}
                  >
                    <p>
                      This email has been generated for
                      <a
                        href="https://beta2.mergerware.com"
                        target="_blank"
                        data-saferedirecturl="https://www.google.com/url?q=https://beta2.mergerware.com&source=gmail&ust=1706858048802000&usg=AOvVaw0yhx9bdjpKKyTljVy9dAP2"
                      >
                        https://beta2.mergerware.com
                      </a>
                      .
                    </p>
                    Have a&nbsp;question?
                    <a
                      href="mailto:support@mergerware.com"
                      style={{
                        color: "#127db3",
                        fontFamily: "roboto",
                        fontSize: 14,
                        fontWeight: 400,
                        lineHeight: "160%",
                      }}
                      target="_blank"
                    >
                      support@mergerware.com
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              border={0}
              cellPadding={0}
              cellSpacing={0}
              align="center"
              width={560}
              style={{
                borderCollapse: "collapse",
                borderSpacing: 0,
                padding: 0,
                width: "inherit",
                maxWidth: 560,
              }}
            >
              <tbody>
                <tr>
                  <td
                    align="center"
                    valign="top"
                    style={{
                      borderCollapse: "collapse",
                      borderSpacing: 0,
                      margin: 0,
                      padding: 0,
                      paddingLeft: "6.25%",
                      paddingRight: "6.25%",
                      width: "87.5%",
                      paddingTop: 20,
                    }}
                  >
                    <table
                      width={100}
                      border={0}
                      cellPadding={0}
                      cellSpacing={0}
                      align="center"
                      style={{
                        borderCollapse: "collapse",
                        borderSpacing: 0,
                        padding: 0,
                      }}
                    >
                      <tbody>
                        <tr>
                          <td
                            align="center"
                            valign="middle"
                            style={{
                              margin: 0,
                              padding: 0,
                              paddingLeft: 10,
                              paddingRight: 10,
                              borderCollapse: "collapse",
                              borderSpacing: 0,
                            }}
                          >
                            <a
                              href="https://www.linkedin.com/company/mergerware/"
                              style={{ textDecoration: "none" }}
                              target="_blank"
                              data-saferedirecturl="https://www.google.com/url?q=https://www.linkedin.com/company/mergerware/&source=gmail&ust=1706858048802000&usg=AOvVaw0Ir9apfMX55q7w_7Ywrx3s"
                            >
                              <img
                                style={{
                                  padding: 0,
                                  margin: 0,
                                  outline: "none",
                                  textDecoration: "none",
                                  border: "none",
                                  display: "inline-block",
                                  color: "#000000",
                                }}
                                alt="T"
                                title="linkedin"
                                width={35}
                                height={35}
                                src="https://ci3.googleusercontent.com/meips/ADKq_NYrJGGYLVCat_uMUXeod1jQLwRXgZMvQ9_sMOfADEjfVo-Z8KuFSRmjKRTMSNwvxH7JMR_jNy5KbOGPLd7pEr5A7qSkUN0n6YIYSj8X8SujgxZ7LK-XHDhN102_ufzL-dwbtdtdykI6CdRiuPuhcJJe5SkAYpja00bssRIQHF0imCpFHVMSDfZ58U_juq9-Qrlf4oAR5KPu7bsp6I4=s0-d-e1-ft#https://66.media.tumblr.com/51a559df933f60aee8c103ccd9e3f125/ec42f49c795db5c3-0a/s540x810/a1fa7f02668b4896f4c862eaa4d54c5f1890b600.png"
                                className="CToWUd"
                                data-bit="iit"
                              />
                            </a>
                          </td>
                          <td
                            align="center"
                            valign="middle"
                            style={{
                              margin: 0,
                              padding: 0,
                              paddingLeft: 10,
                              paddingRight: 10,
                              borderCollapse: "collapse",
                              borderSpacing: 0,
                            }}
                          >
                            <a
                              href="https://twitter.com/MergerWare/"
                              style={{ textDecoration: "none" }}
                              target="_blank"
                              data-saferedirecturl="https://www.google.com/url?q=https://twitter.com/MergerWare/&source=gmail&ust=1706858048802000&usg=AOvVaw3ChJH9laD-pvVufMgorEk6"
                            >
                              <img
                                style={{
                                  padding: 0,
                                  margin: 0,
                                  outline: "none",
                                  textDecoration: "none",
                                  border: "none",
                                  display: "inline-block",
                                  color: "#000000",
                                }}
                                alt="G"
                                title="twitter"
                                width={34}
                                height={34}
                                src="https://ci3.googleusercontent.com/meips/ADKq_NZZFwWR6w6c-1p3S4pFTLq6oJJq5mdH5ptgTYRMZRH4qYMsN-G1zVmuQ29IiYe3Ziacyxp96AIgepRSrqdDU0NeoNbMSXfVLRzXYB92UF9Nh12dyWzjM8kBfrf3-q5iiTQCbpTbVFnEnKwfNDurwL9CT6CsVRvLhPWd2GF_-ezcyzFRT2JGjk_yBcP4bpwjiTcuvxjRPWJks0hUhk0=s0-d-e1-ft#https://66.media.tumblr.com/21280b3a7cfd4b4e0eac783ffdf23d1c/3ee693c8ca2b8938-57/s540x810/73da158a5e3bbd4bafd8e52f72525670db285104.png"
                                className="CToWUd"
                                data-bit="iit"
                              />
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td
                    align="center"
                    valign="top"
                    style={{
                      borderCollapse: "collapse",
                      borderSpacing: 0,
                      margin: 0,
                      padding: 0,
                      paddingLeft: "6.25%",
                      paddingRight: "6.25%",
                      width: "87.5%",
                      fontSize: 13,
                      fontWeight: 400,
                      lineHeight: "150%",
                      paddingTop: 5,
                      paddingBottom: 5,
                      color: "#999999",
                      fontFamily: "roboto",
                    }}
                  >
                    <p>© Mergerware. All rights reserved.</p>
                    <p />
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <div className="yj6qo" />
    <div className="adL"></div>
  </div>
);
